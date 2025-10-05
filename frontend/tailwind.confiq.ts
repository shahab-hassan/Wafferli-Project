/** @type {import('tailwindcss').Config} */
module.exports = {
  	"content": [
    		"./pages/**/*.{js,ts,jsx,tsx}",
    		"./components/**/*.{js,ts,jsx,tsx}"
  	],
  	"theme": {
    		"extend": {
      			"colors": {
        				"white": "#fff",
        				"gainsboro": "#e0e0e0",
        				"darkslategray": "#333",
        				"gold": {
          					"100": "#fecd07",
          					"200": "#f8c600"
        				},
        				"gray": {
          					"100": "#828282",
          					"200": "#282828",
          					"300": "#1d1d1d",
          					"400": "rgba(255, 255, 255, 0.5)"
        				},
        				"black": "#000",
        				"purple": {
          					"100": "#762c85",
          					"200": "rgba(118, 44, 133, 0.56)"
        				},
        				"deeppink": {
          					"100": "#f6339a",
          					"200": "#e71e86"
        				},
        				"silver": {
          					"100": "#c4c4c4",
          					"200": "#bdbdbd"
        				},
        				"dimgray": "#4f4f4f",
        				"limegreen": "#00c951",
        				"darkgoldenrod": "#d08700",
        				"lavenderblush": {
          					"100": "#fdf2f8",
          					"200": "#f2eaf3"
        				},
        				"ivory": "#fffbeb",
        				"orange": "#fd9a00",
        				"forestgreen": "#008236",
        				"honeydew": "#dcfce7",
        				"azure": "#ecfeff",
        				"deepskyblue": "#00b8db"
      			},
      			"fontFamily": {
        				"inter": "Inter"
      			}
    		}
  	},
  	"corePlugins": {
    		"preflight": false
  	}
}