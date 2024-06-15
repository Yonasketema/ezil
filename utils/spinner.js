import * as p from "@clack/prompts";
import color from "picocolors";
import { setTimeout } from "node:timers/promises";

const spin = p.spinner();

export const spinnerWrapper = async (fun, param) => {
  spin.start();
  spin.message(`Loading Your Data wwwww.`);
  await setTimeout(1000);
  const response = await fun(param);
  return response;
};

const catchAsync = (fn) => {
  // without return   the function called  in router function
  //Error : the function is not callback function
  return (req, res, next) => {
    //fn is asunc function wait until its call form router
    fn(req, res, next).catch(next);
  };
};
