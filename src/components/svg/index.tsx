import arms from "./arms";
import back from "./back";
import background from "./background";
import body from "./body";
import eyes from "./eyes";
import legs from "./legs";
import mouth from "./mouth";

export const puppet = [body, mouth, eyes, arms, legs, back, background];

export const getPartByKey = (key: string) => puppet.find((s) => s.key === key);
