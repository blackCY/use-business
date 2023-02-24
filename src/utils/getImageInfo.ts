export const getImageInfo = (imageUrl: string) => {
  return new Promise<{
    width: number;
    height: number;
  }>(resolve => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
};
