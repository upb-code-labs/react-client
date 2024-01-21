import { BugIcon, GitPullRequestArrowIcon, SearchIcon } from "lucide-react";

export const OpenSourceSection = () => {
  const actions = [
    {
      text: "Walk through / audit the source code",
      icon: SearchIcon
    },
    {
      text: "Report bugs or issues",
      icon: BugIcon
    },
    {
      text: "Submit pull requests",
      icon: GitPullRequestArrowIcon
    }
  ];

  return (
    <section
      className="mx-auto my-8 max-w-7xl px-4
    "
    >
      <h2 className="mb-8 text-3xl font-semibold">
        We're an open source project
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Text container*/}
        <div className="space-y-4 text-pretty text-lg">
          <p className="max-w-prose">
            We believe that making Code Labs an open source project will help us
            to build, maintain, and evolve the project as more people from our
            university community involve themselves in the project. Feel free
            to:
          </p>
          <ul className="flex flex-col gap-4">
            {actions.map((action, index) => (
              <li key={`open-source-action-${index}`}>
                <div className="flex items-center gap-4">
                  <span className="grid aspect-square place-items-center rounded-full bg-gradient-to-r from-red-upb to-purple-upb p-3">
                    <action.icon size={20} color="white" />
                  </span>{" "}
                  {action.text}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Image container*/}
        <div className="grid place-items-center">
          <img
            src="/images/coders-image.svg"
            alt="Two programmers working on a project"
            className="w-full max-w-sm md:max-w-[75%]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
