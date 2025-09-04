// tiny image cache
const ImageCache = {
  _cache: {},
  get(src) {
    if (this._cache[src]) return this._cache[src];
    const img = new Image();
    img._loaded = false;
    img.onload = () => { img._loaded = true; };
    img.src = src;
    this._cache[src] = img;
    return img;
  },
};

// ------------------ GameObject (updated) ------------------
class GameObject {
  constructor(
    x, y,
    imageSrc,
    frameWidth, frameHeight,
    animsOrFrames = [0],
    fps = 6,
    scale = 1,
    loop = true,
    hitboxWidth = null,
    hitboxHeight = null,
    hitboxOffsetX = 0,
    hitboxOffsetY = 0,
    sheetCols = 0
  ) {
    this.x = x;
    this.y = y;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // animations: support array or object map
    if (Array.isArray(animsOrFrames)) {
      this.animations = { idle: animsOrFrames.slice() };
      this.currentAnimation = 'idle';
    } else {
      this.animations = {};
      for (const k in (animsOrFrames || {})) {
        const f = animsOrFrames[k];
        this.animations[k] = Array.isArray(f) ? f.slice() : [f];
      }
      this.currentAnimation = this.animations.idle ? 'idle' : (Object.keys(this.animations)[0] || 'idle');
    }
    this.frames = this.animations[this.currentAnimation] || [0];

    this.fps = fps;
    this.msPerFrame = this.fps > 0 ? 1000 / this.fps : Infinity;
    this.scale = scale;
    this.loop = !!loop;

    this.currentFrameIndex = 0;
    this._acc = 0;
    this._lastTime = 0;

    this.image = ImageCache.get(imageSrc);
    this.sheetCols = Math.max(0, Math.floor(sheetCols) || 0);

    // collision footprint (defaults to sprite size * scale)
    this.hitboxWidth  = hitboxWidth  ?? Math.round(frameWidth * scale);
    this.hitboxHeight = hitboxHeight ?? Math.round(frameHeight * scale);
    this.hitboxOffsetX = hitboxOffsetX;
    this.hitboxOffsetY = hitboxOffsetY;

    this.width = this.hitboxWidth;
    this.height = this.hitboxHeight;

    // movement velocity px/sec (this class uses time-based movement)
    this.vx = 0;
    this.vy = 0;

    // patrol object {minX, maxX} optional
    this.patrol = null;

    // auto animation switching based on movement
    this.autoAnimate = true;
    this._prevX = this.x;
    this._prevY = this.y;

    // flip horizontally if vx < 0
    this.flipX = false;

    // pattern state container (set via setPattern)
    this.pattern = null;
    this._patternState = null;
  }

  // keep your existing animation setter
  setAnimation(name, { force = false } = {}) {
    if (!name || !this.animations[name]) return false;
    if (this.currentAnimation === name && !force) return true;
    this.currentAnimation = name;
    this.frames = this.animations[name];
    this.currentFrameIndex = 0;
    this._acc = 0;
    return true;
  }

  setAutoAnimate(enabled) {
    this.autoAnimate = !!enabled;
  }

  // new: set a pattern (idle/walk) for the object
  // pattern = { idleDuration(ms), walkDuration(ms), speed(px/sec), type: 'patrolIfPresent'|'random'|'leftRight'|'patrol', initialDir: -1|1 }
  setPattern(pattern = {}) {
    const p = {
      idleDuration: pattern.idleDuration ?? 2000,
      walkDuration: pattern.walkDuration ?? 2000,
      speed: pattern.speed ?? 24,
      type: pattern.type ?? 'patrolIfPresent',
      initialDir: pattern.initialDir ?? -1
    };
    this.pattern = p;
    this._patternState = null; // will initialize in update()
    // ensure we start visually idle
    if (this.animations && ('idle' in this.animations)) this.setAnimation('idle', { force: true });
    this.vx = 0;
    this.vy = 0;
  }

  getHitboxAt(x = this.x, y = this.y) {
    return {
      x: x + this.hitboxOffsetX,
      y: y + this.hitboxOffsetY,
      width: this.hitboxWidth,
      height: this.hitboxHeight,
    };
  }

  getHitbox() {
    return this.getHitboxAt();
  }

  // time: rAF timestamp ms
  update(time = 0) {
    // don't run until image ready
    if (!this.image.complete && !this.image._loaded) return;

    // compute dt in ms
    const dt = this._lastTime ? (time - this._lastTime) : 0;
    this._lastTime = time;

    // ----- Pattern AI (idle <-> walk) -----
    // initialize pattern state (do this even if dt === 0 so animation is set right away)
    if (this.pattern && !this._patternState) {
      this._patternState = {
        state: 'idle',
        timer: this.pattern.idleDuration,
        dir: this.pattern.initialDir ?? -1
      };
      // remain stationary initially
      this.vx = 0;
      if (this.animations && ('idle' in this.animations)) this.setAnimation('idle', { force: true });
    }

    if (this.pattern && dt > 0) {
      // decrement and handle possible multi-transition if dt > duration
      this._patternState.timer -= dt;
      while (this._patternState.timer <= 0) {
        if (this._patternState.state === 'idle') {
          // -> walk
          this._patternState.state = 'walk';
          // carryover the negative time so we don't lose time
          this._patternState.timer += this.pattern.walkDuration;

          // determine walk direction
          let dir = this._patternState.dir ?? this.pattern.initialDir ?? -1;
          const type = this.pattern.type;

          if ((type === 'patrol' || (type === 'patrolIfPresent' && this.patrol)) && this.patrol) {
            // choose direction toward nearest patrol bound (so pattern cooperates with patrol)
            const mid = (this.patrol.minX + this.patrol.maxX) / 2;
            dir = (this.x > mid) ? -1 : 1;
          } else if (type === 'random') {
            dir = (Math.random() < 0.5) ? -1 : 1;
          } else if (type === 'leftRight') {
            dir = - (dir || -1);
          }
          this._patternState.dir = dir;

          // set horizontal velocity (px/sec)
          this.vx = dir * (this.pattern.speed);

          // pick walk animation if available
          if (this.animations && ('walk' in this.animations)) this.setAnimation('walk', { force: true });
        } else {
          // -> idle
          this._patternState.state = 'idle';
          this._patternState.timer += this.pattern.idleDuration;
          // stop movement
          this.vx = 0;
          if (this.animations && ('idle' in this.animations)) this.setAnimation('idle', { force: true });
        }
      }
    }

    // movement (time-based), axis-separated with collision checks if obstacles global exists
    if (dt > 0 && (this.vx !== 0 || this.vy !== 0)) {
      // ---------- X axis ----------
      if (this.vx !== 0) {
        const nextX = this.x + this.vx * (dt / 1000);
        const testBoxX = this.getHitboxAt(nextX, this.y);

        // robust collision loop (skips this, uses global isColliding if present)
        let blockedX = false;
        if (window.obstacles && Array.isArray(window.obstacles)) {
          for (const obs of window.obstacles) {
            if (!obs || obs === this) continue; // skip nulls and self
            const other = (typeof obs.getHitbox === 'function') ? obs.getHitbox() : obs;

            if (typeof isColliding === 'function') {
              try {
                if (isColliding(testBoxX, other)) {
                  blockedX = true;
                  break;
                }
              } catch (err) {
                // If isColliding throws, ignore this obs and continue (defensive)
                continue;
              }
            }
          }
        }

        if (!blockedX) {
          this.x = nextX;
        } else {
          // reverse direction on collision (patrol/backoff behaviour)
          this.vx = -this.vx;
          // also reflect pattern direction if present
          if (this._patternState) {
            this._patternState.dir = -this._patternState.dir;
          }
        }
      }

      // ---------- Y axis ----------
      if (this.vy !== 0) {
        const nextY = this.y + this.vy * (dt / 1000);
        const testBoxY = this.getHitboxAt(this.x, nextY);

        let blockedY = false;
        if (window.obstacles && Array.isArray(window.obstacles)) {
          for (const obs of window.obstacles) {
            if (!obs || obs === this) continue;
            const other = (typeof obs.getHitbox === 'function') ? obs.getHitbox() : obs;

            if (typeof isColliding === 'function') {
              try {
                if (isColliding(testBoxY, other)) {
                  blockedY = true;
                  break;
                }
              } catch (err) {
                continue;
              }
            }
          }
        }

        if (!blockedY) {
          this.y = nextY;
        } else {
          this.vy = -this.vy;
        }
      }

      // patrol clamps (if defined)
      if (this.patrol) {
        if (this.x < this.patrol.minX) {
          this.x = this.patrol.minX;
          this.vx = Math.abs(this.vx);
          if (this._patternState) this._patternState.dir = 1;
        } else if (this.x > this.patrol.maxX) {
          this.x = this.patrol.maxX;
          this.vx = -Math.abs(this.vx);
          if (this._patternState) this._patternState.dir = -1;
        }
      }
    } // end movement

    // detect movement with a small threshold to avoid float noise toggling animations
    const MOVE_THRESHOLD = 0.5; // pixels
    const moved = Math.abs(this.x - this._prevX) > MOVE_THRESHOLD || Math.abs(this.y - this._prevY) > MOVE_THRESHOLD;

    // auto animate switch (walk <-> idle) - only if user hasn't forced animation by pattern
    if (this.autoAnimate && !this.pattern) {
      if (moved) {
        const preferred = ['walk','walking','move','run','running'];
        let found = preferred.find(n => n in this.animations);
        if (!found) {
          const keys = Object.keys(this.animations);
          found = keys.find(k => k !== this.currentAnimation && k !== 'idle');
        }
        if (found) this.setAnimation(found);
      } else {
        if ('idle' in this.animations) this.setAnimation('idle');
      }
    }

    // advance animation frames (time-based)
    if (this.frames && this.frames.length > 1 && this.fps > 0) {
      this._acc += dt;
      while (this._acc >= this.msPerFrame) {
        this._acc -= this.msPerFrame;
        if (this.currentFrameIndex < this.frames.length - 1) {
          this.currentFrameIndex++;
        } else if (this.loop) {
          this.currentFrameIndex = 0;
        }
      }
    }

    // update flipX for drawing
    this.flipX = this.vx < 0;

    // store prev pos
    this._prevX = this.x;
    this._prevY = this.y;
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.image.complete && !this.image._loaded) return;

    const frameNum = (this.frames && this.frames[this.currentFrameIndex] !== undefined) ? this.frames[this.currentFrameIndex] : 0;

    let sx, sy;
    if (this.sheetCols > 0) {
      sx = (frameNum % this.sheetCols) * this.frameWidth;
      sy = Math.floor(frameNum / this.sheetCols) * this.frameHeight;
    } else {
      sx = frameNum * this.frameWidth;
      sy = 0;
    }

    const dw = Math.round(this.frameWidth * this.scale);
    const dh = Math.round(this.frameHeight * this.scale);
    const dx = Math.round(this.x - offsetX);
    const dy = Math.round(this.y - offsetY);

    const prevSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    if (this.flipX) {
      ctx.save();
      ctx.translate(dx + dw / 2, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, -dw / 2, 0, dw, dh);
      ctx.restore();
    } else {
      ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, dx, dy, dw, dh);
    }

    ctx.imageSmoothingEnabled = prevSmooth;
  }
}