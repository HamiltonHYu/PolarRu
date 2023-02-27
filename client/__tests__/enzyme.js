import React from "react";
import * as enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../src/App";

enzyme.configure({ adapter: new Adapter() });

describe("React unit tests", () => {
  describe("App", () => {
    let wrapper;

    beforeAll(() => {
      wrapper = enzyme.shallow(<App />);
    });

    it("Renders app", () => {
      // console.log(wrapper.debug());
      expect(wrapper.find("main").exists()).toBeTruthy();
      expect(wrapper.find("Switch").exists()).toBe(true);
      expect(wrapper.find("Route").exists()).toBe(true);
    });
  });
});
