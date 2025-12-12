type imagesProps = {
  src: string;
  width: number;
  heigth: number;
};

export default function ImageComponent({ src,width,heigth }: imagesProps) {

  return (
    <img
      src={src}
      style={{ width: `${width}%`, height: `${heigth}%`, objectFit: "cover" }}
    />

  );
}
