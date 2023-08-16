import { RootState } from "../store";

const selectUserData = (state: RootState) => state.userData.data;

export default selectUserData;
