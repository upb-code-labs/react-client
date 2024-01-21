import { buttonVariants } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

import styles from "./HomeHeader.module.css";

export const HomeHeader = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="px-4">
      <header
        className={`relative mx-auto my-8 max-w-7xl overflow-hidden rounded-3xl ${styles.hero}`}
      >
        {/* Hero content container */}
        <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12">
          {/* Texts container */}
          <div className="grid place-items-center">
            <div className="flex max-w-prose flex-col items-center gap-4 text-pretty text-center md:items-start md:text-start">
              <h1 className="text-3xl font-bold !leading-snug sm:text-4xl md:text-5xl">
                Simplify learning through{" "}
                <span className="text-purple-upb">
                  programming learning activities
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-black/75">
                With Code Labs, students receive instant feedback, while
                educators enjoy simplified grading and monitoring in coding
                activities.
              </p>
              <div>
                {user ? (
                  <Link
                    to="/courses"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg"
                    })}
                  >
                    Go to courses
                  </Link>
                ) : (
                  <Link
                    to="/register/students"
                    className={buttonVariants({
                      variant: "default",
                      size: "lg"
                    })}
                  >
                    Get started
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* Image container */}
          <div className="grid place-items-center">
            <img
              src="/images/hero-education-image.svg"
              alt="A student with a graduation cap on top of a book"
              className="w-full max-w-sm md:max-w-full xl:max-w-[75%]"
              loading="eager"
            />
          </div>
        </div>
      </header>
    </div>
  );
};
