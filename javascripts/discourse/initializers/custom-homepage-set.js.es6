import { setDefaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";
import { withPluginApi } from "discourse/lib/plugin-api";
import { computed } from "@ember/object";
import getURL from "discourse-common/lib/get-url";
import mobile from "discourse/lib/mobile";

export default {
  name: "discourse-custom-homepage",
  afterModel: (model) => model.reload(),
  initialize(container) {
    withPluginApi("0.11.4", (api) => {
      window.console.log("doing the cool thing!", mobile);
      const user = api.getCurrentUser();
      window.console.log("s,u", settings, user, settings.group_page_map);
      const { setDefaultHomepage } = require("discourse/lib/utilities");
      if (user && user.primary_group_name) {
        if (settings.group_page_map) {
          window.console.log("map", settings.group_page_map);
          var groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            const url = mapEntry.split(":")[1];
            window.console.log("map url", url);
            setDefaultHomepage(url);
          }
        }
      } else {
        window.console.log("doing else", mobile.isMobileDevice);
        if (mobile.isMobileDevice && settings.mobile_homepage) {
          window.console.log("setting mobile", settings.mobile_homepage);
          setDefaultHomepage(settings.mobile_homepage);
        } else if (settings.anon_page) {
          window.console.log("setting anon", settings.mobile_homepage);

          setDefaultHomepage(settings.anon_page);
        }
      }
    });
  },
};