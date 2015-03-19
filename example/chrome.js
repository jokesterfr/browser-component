/*
 * @file chrome.js
 * @author Clément Désiles <main@jokester.fr>
 * @date 2013-11-26
 * 
 * Script starting the application in a fullscreen window
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
'use strict';

/**
 * Creates the window for the application.
 * @return none
 */
var runApp = function() {
	chrome.system.display.getInfo(function(info) {
		var screen0 = info[0].workArea;
		chrome.app.window.create('./example/index.html', {
			frame: 'none',
			id: 'tsterminal',
			bounds: {
				width: screen0.width,
				height: screen0.height,
				top: screen0.top,
				left: screen0.left
			},
			resizable: false
		}, function onWindowCreated(win) {
			console.log('window created');
		});
	});
}

chrome.app.runtime.onLaunched.addListener(runApp);
chrome.app.runtime.onRestarted.addListener(runApp);
