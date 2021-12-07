import type { GetStaticProps, NextPage } from "next";
import { getRoutineUseCase } from "../main";

const Home: NextPage = () => {
  return <div>Rotinas Médicas</div>;
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
  getRoutineUseCase.getRoutine({ id: "62ef44b15c064a7b9812e45960c9e4ce" });
  return {
    props: {},
  };
};
