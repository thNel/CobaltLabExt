import {lazy} from "react";
import {useInitial} from "./useInitial";

const ComponentPreviews = lazy(() => import("./previews"));

export {
  ComponentPreviews,
  useInitial
};