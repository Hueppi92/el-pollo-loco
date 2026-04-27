class DrawableObject {
  x;
  y;
  img;
  height;
  width;
  imageCache = {};
  currentImage = 0;

  /** Tracks the last animation array to detect animation switches and reset the frame index. */
  lastAnimationImages = null;

  /** Pixels trimmed from the top of the sprite when calculating the collision box. */
  offsetTop = 0;
  /** Pixels trimmed from the bottom of the sprite when calculating the collision box. */
  offsetBottom = 0;
  /** Pixels trimmed from the left of the sprite when calculating the collision box. */
  offsetLeft = 0;
  /** Pixels trimmed from the right of the sprite when calculating the collision box. */
  offsetRight = 0;

  /**
   * Loads a single image and sets it as the active image.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads an array of images into the internal image cache.
   * @param {string[]} arr - Array of image paths to preload.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the given canvas rendering context.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a blue debug rectangle around the object's collision box.
   * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on.
   */
  drawFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "blue";
    ctx.rect(
      this.x + this.offsetLeft,
      this.y + this.offsetTop,
      this.width - this.offsetLeft - this.offsetRight,
      this.height - this.offsetTop - this.offsetBottom
    );
    ctx.stroke();
  }

  /**
   * Advances the animation by one frame through the given image array.
   * Automatically resets to frame 0 whenever the animation set changes,
   * ensuring every animation always starts from its first frame.
   * @param {string[]} images - Ordered array of image paths for this animation.
   */
  playAnimation(images) {
    if (!images || images.length === 0) return;
    if (this.lastAnimationImages !== images) {
      this.currentImage = 0;
      this.lastAnimationImages = images;
    }
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }
}
