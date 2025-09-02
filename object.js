class GameObject {
    constructor(x, y, image, frameWidth, frameHeight, frames, frameDelay = 10) {
      this.x = x;
      this.y = y;
      this.image = image;
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;
      this.frames = frames;
      this.frameDelay = frameDelay;

      this.currentFrame = 0;
      this.frameCounter = 0;

      this.width = frameWidth * 2;
      this.height = frameHeight * 2;
    }
  
    draw(ctx, offsetX, offsetY) {

        const frameIndex = this.frames[this.currentFrame];

        ctx.drawImage(
            this.image,
            frameIndex * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            this.x - offsetX,
            this.y - offsetY,
            this.frameWidth * 2,
            this.frameHeight * 2,
        );

        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        ctx.fillRect(this.x - offsetX, this.y - offsetY, this.width, this.height);
    }

    update() {
        this.frameCounter++;

        if (this.frameCounter >= this.frameDelay) {
          this.frameCounter = 0;
          this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    }
    
}

const cowImage = new Image();
cowImage.src = "cow-sprite.png";

const objects = [];

cowImage.onload = () => {
    objects.push(
        new GameObject(
            22 * TILE_SIZE, 8 * TILE_SIZE, 
            cowImage,
            32, 32,
            [0, 1, 2],
            30,
        )
    );
};