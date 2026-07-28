/**
 * Static CSS dot grid, shown while the shader chunk loads and kept as the
 * permanent backdrop on machines with no WebGL context.
 */
export function BackdropFallback() {
  return (
    <div
      className="backdrop__field backdrop__field--fallback"
      aria-hidden="true"
    />
  );
}
