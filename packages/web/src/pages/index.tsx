import type { GetStaticProps, NextPage } from "next";
import { routinesRepository } from "../backend";

const Home: NextPage = () => {
  return <div>Rotinas Médicas</div>;
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
  routinesRepository.getRoutine("any");
  return {
    props: {},
  };
};
