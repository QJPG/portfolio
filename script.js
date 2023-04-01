const WINDOWS_MANAGER = 0

var dirs = {
	"cd": {
		"about": "/aboutme.html",
		"social": {
			"github": "https://github.com/portagochi",
			"replit": "https://replit.com/@portagochi"
		},
		"projects": {
			"python": {
				"api": "/projects/python/api"
			}
		},
		"task-manager": WINDOWS_MANAGER
	}
}

var latest_console_paths = []
var mouse_press = false
var oldMouse = {
	x: 0,
	y: 0,
	wx: 0,
	wy: 0
}
var latest_focus_window = null

window.onload = function() {
	showConsole()

	document.onmousedown = ev => {
		if (ev.button == 0) {
			mouse_press = true
			oldMouse.x = ev.clientX
			oldMouse.y = ev.clientY
		}
	}

	document.onmouseup = ev => {
		mouse_press = false

		oldMouse.wx = ev.clientX
		oldMouse.wy = ev.clientY
	}
}

function exit() {
	showPersistentPopup('Você tem certeza que deseja sair?', ['Sim (!)', "Não"], ev => {
		console.log(ev)
		
		if (ev.index === 0) {
			//window.close()
			showPersistentPopup('Desculpa, essa ação requer permissão root:)', ['Blz, vou continuar então!'], function(ev){})
		}
	})
}

function showBrowserWindow(url) {
	// const fade = document.createElement('div')
	// fade.className="flex justify-center items-center"

	const windowBrowser = document.createElement('div')
	const windowHeader = document.createElement('div')
	const windowBody = document.createElement('div')
	const btnClose = document.createElement('div')
	const pageView = document.createElement('iframe')
	
	windowBrowser.className="animate-[fade-in_ease_300ms] flex flex-col bg-white rounded-md absolute overflow-hidden shadow-lg w-3/4 h-3/4 m-1"

	windowBrowser.onmousedown = ev => {
		if (latest_focus_window != null)
			latest_focus_window.style.zIndex = 0
		
		windowBrowser.style.zIndex = 1
		
		latest_focus_window = windowBrowser
	}

	windowBrowser.appendChild(windowHeader)
	windowBrowser.appendChild(windowBody)

	windowHeader.className="cursor-move flex bg-white items-center flex-row relative"
	windowHeader.innerHTML = `
 	<div class="flex justify-center w-full">
   		<div class="flex flex-row m-1 bg-slate-100 rounded-full float-center justify-center items-center relative">
  	 		<input type="text" value="` + url + `" class="p-1 outline-none bg-transparent text-black" placeholder="url://" />
		</div>
	</div>
  	`
	windowHeader.firstChild.after(btnClose)
	
	windowHeader.onmousemove = ev => {
		if (mouse_press) {
			windowBrowser.style.left = oldMouse.wx + (ev.clientX - oldMouse.x) + "px"
			windowBrowser.style.top = oldMouse.wy + (ev.clientY - oldMouse.y) + "px"
		} else {
			oldMouse.wx = parseInt(windowBrowser.style.left) || 0
			oldMouse.wy = parseInt(windowBrowser.style.top) || 0
		}
	}

	windowBody.className="h-full w-full"

	windowBody.appendChild(pageView)

	pageView.className="w-full h-full border-none"

	btnClose.className="w-btn bg-red-500 m-2"
	btnClose.onclick = ev => {
		windowBrowser.parentNode.removeChild(windowBrowser)
	}

	pageView.src=url

	document.querySelector('main').appendChild(windowBrowser)
	
}

function showPersistentPopup(message, options, callback) {
	const fade = document.createElement('div')
	const popup = document.createElement('div')
	const popupBody = document.createElement('div')
	const popupFooter = document.createElement('div')
	
	fade.className="flex justify-center items-center fixed w-full h-full z-10"
	
	popup.className="flex p-1 flex-col overflow-hidden absolute min-w-[5%] h-[100px] bg-white rounded-md text-black shadow-lg animate-[fade-in_ease_1s]"

	popup.appendChild(popupBody)
	popup.appendChild(popupFooter)

	popupBody.className="overflow-auto flex h-full w-full justify-center items-center text-black"
	popupBody.innerText = message

	popupFooter.className="flex justify-center items-center w-full"

	for (let i = 0; i < options.length; i++) {
		const btn = document.createElement('button')
		btn.innerText = options[i]
		btn.className="flex bg-blue-500 text-white rounded-md py-0.5 m-1 px-5 hover:bg-slate-950 transition-all"
		btn.onclick = ev => {
			fade.parentNode.removeChild(fade)
			return callback({
				index: i,
				response: options[i]
			})
		}
		popupFooter.appendChild(btn)
	}
	

	fade.appendChild(popup)

	document.querySelector('main').appendChild(fade)
}

function showConsole() {
	const window = document.createElement('div')
	const windowHead = document.createElement('div')
	const windowBody = document.createElement('div')

	window.className="m-1 animate-[fade-in_ease_800ms] shadow-lg flex w-3/4 h-3/4 bg-zinc-900 rounded-md absolute overflow-hidden flex-col text-white"

	window.appendChild(windowHead)
	window.appendChild(windowBody)

	windowHead.className="flex bg-slate-5"
	windowHead.innerHTML = `
 	<div class="w-btn bg-red-500" onclick="exit()"></div>
  	<div class="w-btn bg-yellow-500"></div>
   	<div class="w-btn bg-lime-500"></div>
 	`

	windowBody.className="flex h-full overflow-auto bg-slate-0 flex-col"
	
	var goTo = (path) => {
		if (isNaN(path) == true)
			showBrowserWindow(path)
		else
			console.log(path)
	}
	
	var drawConsole = (path_dir) => {
		windowBody.innerHTML = ""
		
		for (const app in path_dir) {
			const consoleRow = document.createElement('div')
			consoleRow.className="flex selection:bg-fuchsia-300 overflow-hidden transition-all hover:p-2 cursor-pointer hover:bg-blue-500 hover:text-black p-1 text-white text-[12.0px] animate-[fade-in_ease_1s]"
			consoleRow.innerText="./" + app + "/"
			consoleRow.onclick = ev => {
				if (typeof path_dir[app] === "object") {
					latest_console_paths.push(path_dir)
					
					drawConsole(path_dir[app])
				} else {
					goTo(path_dir[app])
				}
			}
	
			windowBody.appendChild(consoleRow)
		}

		const returnRow = document.createElement('div')
		returnRow.className="flex transition-all cursor-pointer p-1 text-white text-[12.0px] hover:bg-red-500 hover:text-white"
		returnRow.innerText="(exit)"
		returnRow.onclick = ev => {
			if (latest_console_paths.length > 0) {
				drawConsole(latest_console_paths[latest_console_paths.length - 1])
				latest_console_paths.splice(latest_console_paths.length - 1, 1)
			}
		}

		windowBody.appendChild(returnRow)
	}

	drawConsole(dirs["cd"])

	document.querySelector('main').appendChild(window)
}