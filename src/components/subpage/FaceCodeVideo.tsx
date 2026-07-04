/**
 * FaceCodeVideo — a native HTML5 background visual (no player, no controls).
 *
 * The source clip has a light background; on our black page we crop tightly to
 * the eyes/glasses (object-cover + scale) and blend the light edges into the
 * page with an aggressive inset vignette so it reads as a mysterious AI
 * interface rather than a video element. Renders server-side (attributes only,
 * no client JS).
 */
export default function FaceCodeVideo({ src }: { src: string }) {
  return (
    <div
      className="relative flex h-full min-h-[500px] w-full overflow-hidden rounded-3xl bg-black lg:min-h-[650px]"
      aria-hidden="true"
    >
      <video
        className="h-full w-full scale-110 object-cover object-center contrast-125 grayscale"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Vignette overlay: blacks out the edges so the light video border fades
          completely into the site's black background. */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.9) 100%)",
          boxShadow:
            "inset 0 0 100px 50px rgba(0,0,0,1), inset 0 0 40px 12px rgba(0,0,0,0.95)",
        }}
      />
    </div>
  );
}
