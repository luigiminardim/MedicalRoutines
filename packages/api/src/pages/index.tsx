import type { GetStaticProps, NextPage } from "next";
import { getRoutineUseCase } from "../main";

const Home: NextPage = () => {
  return <div>Rotinas Médicas</div>;
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
  getRoutineUseCase.getRoutine({ routineSlug: "test" });
  return {
    props: {},
  };
};
