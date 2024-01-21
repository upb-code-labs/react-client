import features from "../data/features.json";

export const HomeFeatures = () => {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          Main features
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
          {features.map((feature, index) => (
            <article
              key={`feature-${index}`}
              className="group flex flex-col justify-between overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="space-y-4 text-pretty p-8 pb-0">
                <h3 className="text-2xl font-semibold text-neutral-700">
                  {feature.name}
                </h3>
                <p className="text-lg text-neutral-600">
                  {feature.description}
                </p>
              </div>
              <img
                src={feature.image}
                alt={`${feature.name} screenshot`}
                className="self-end transition-transform duration-500 group-hover:scale-125"
                width={403}
                height={302}
                loading={index >= 3 ? "lazy" : "eager"}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
