import Image from "next/image";

type PhotoSlotProps = {
  src: string | null;
  alt: string;
  hint: string;
  tone?: "well" | "dashed" | "frame";
  fit?: "cover" | "contain";
  sizes?: string;
};

export function PhotoSlot({
  src,
  alt,
  hint,
  tone = "frame",
  fit = "cover",
  sizes = "(max-width: 900px) 80vw, 480px",
}: PhotoSlotProps) {
  return (
    <span className={`photo-slot photo-slot-${tone}`} title={hint}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className={fit === "contain" ? "object-contain" : "object-cover"} />
      ) : (
        <span className="photo-slot-hint">
          <span>{hint.split("/").pop()}</span>
        </span>
      )}
    </span>
  );
}
