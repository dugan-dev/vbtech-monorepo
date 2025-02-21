import { AutoPlayVideo } from "./auto-play-video";
import { PARTNERING_CONTENT } from "./partnering-content";

export function Partnering() {
  return (
    <section
      className="py-16 bg-white"
      aria-label={PARTNERING_CONTENT.sectionAriaLabel}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-900">
          {PARTNERING_CONTENT.title}
        </h2>
        <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
          {PARTNERING_CONTENT.description}
        </p>
      </div>
      <div className="mt-10 flex justify-center">
        <AutoPlayVideo
          {...PARTNERING_CONTENT.video}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
