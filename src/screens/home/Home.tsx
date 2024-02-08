import { HomeFeatures } from "./components/HomeFeatures";
import { HomeHeader } from "./components/HomeHeader";

/* import { OpenSourceSection } from "./components/OpenSourceSection"; */

export const Home = () => {
  return (
    <main>
      <HomeHeader />
      <HomeFeatures />
      {/* <OpenSourceSection /> */}
    </main>
  );
};
