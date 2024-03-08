/** @param {NS} ns **/
/*
Inspired by https://www.reddit.com/user/pwillia7/
but i wanted to use my own hack script and i didn't want to pass args

https://www.reddit.com/r/Bitburner/comments/rjkn4q/improved_hack_all_servers_script/
*/
export async function main(ns) {
	//if no arguments provided tell the user how to use script.
	ns.toast('Running worm on ' + ns.getHostname());
	//get all servers you can connect to
	var servers = ns.scan(ns.getHostname());
	//get ram for this script
	var scriptram = ns.getScriptRam('worm.js', 'home');
	//get ram for hack script
	var hackscriptram = ns.getScriptRam('hack.js', 'home')
	//get available server ram for this server
	var avsram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) + scriptram;
	//calculate usethreads for hack script for this server
	var hsthreads = Math.floor(avsram / hackscriptram);
	for (const server of servers) {
		//count and use hack tools owned if you don't have root
		var hacktoolnum = 0;
		//attack server
		if (!ns.hasRootAccess(server)) {
			ns.toast('Opening ports on ' + server);
			if (ns.fileExists('BruteSSH.exe', 'home')) {
				ns.brutessh(server);
				hacktoolnum++;
			}
			if (ns.fileExists('FTPCrack.exe', 'home')) {
				ns.ftpcrack(server);
				hacktoolnum++;

			}
			if (ns.fileExists('relaySMTP.exe', 'home')) {
				ns.relaysmtp(server);
				hacktoolnum++;

			}
			if (ns.fileExists('HTTPWorm.exe', 'home')) {
				ns.httpworm(server);
				hacktoolnum++;

			}
			if (ns.fileExists('SQLInject.exe', 'home')) {
				ns.sqlinject(server);
				hacktoolnum++;

			}
		}
		//if you don't have access and used enough tools nuke target server
		if (ns.getServerNumPortsRequired(server) <= hacktoolnum && !ns.hasRootAccess(server)) {
			ns.toast("nuking " + server);
			ns.nuke(server);
		} else
			//if you still don't have access, skip
			if (!ns.hasRootAccess(server)) {
				ns.toast("unable to gain root to " + server, "error");
				continue;
			}
		//if the server has enough ram to run the worm script
		if (ns.getServerMaxRam(server) > ns.getServerUsedRam(server) + scriptram) {
			//copy WORM script to server and run
			ns.print('worm.js being copied to ' + server);
			await ns.scp('worm.js', server, 'home');
			//if you don't see either script running on target server, run worm on it.
			if (!ns.scriptRunning('worm.js', server) && !ns.scriptRunning('hack.js', server)) {
				ns.print('running worm on ' + server);
				await ns.sleep(5000);
				await ns.scp('worm.js', server, 'home');
				ns.exec('worm.js', server, 1, server);
			}
		} else {
			//if server can't run script, look at servers it can connect to, gain root, and run script there
			var moreservs = ns.scan(server);
			for (const server2 of moreservs) {
				var hacktoolnum2 = 0;

				//attack server
				if (!ns.hasRootAccess(server2)) {
					ns.toast('Opening ports on ' + server2)
					if (ns.fileExists('BruteSSH.exe', 'home')) {
						ns.brutessh(server2);
						hacktoolnum2++;
					}
					if (ns.fileExists('FTPCrack.exe', 'home')) {
						ns.ftpcrack(server2);
						hacktoolnum2++;

					}
					if (ns.fileExists('relaySMTP.exe', 'home')) {
						ns.relaysmtp(server2);
						hacktoolnum2++;

					}
					if (ns.fileExists('HTTPWorm.exe', 'home')) {
						ns.httpworm(server2);
						hacktoolnum2++;

					}
					if (ns.fileExists('SQLInject.exe', 'home')) {
						ns.sqlinject(server2);
						hacktoolnum2++;

					}
				}
				if (ns.getServerNumPortsRequired(server2) <= hacktoolnum2 && !ns.hasRootAccess(server2)) {
					ns.toast("nuking " + server2);
					ns.nuke(server2);
				} else
					//if you still don't have access, skip
					if (!ns.hasRootAccess(server2)) {
						ns.toast("unable to gain root to " + server2, "error");
						continue;
					}
				if (ns.getServerMaxRam(server2) > ns.getServerUsedRam(server2) + scriptram) {
					//copy WORM script to server and run
					ns.print('worm.js being copied to ' + server2);
					await ns.scp('worm.js', server2, 'home');
					if (!ns.scriptRunning('worm.js', server2) && !ns.scriptRunning('hack.js', server2)) {
						ns.print('running worm on ' + server2);
						await ns.sleep(5000);
						await ns.scp('worm.js', server2, 'home');
						ns.exec('worm.js', server2, 1, server2);
					}
				}
			}
		}
	}
	//if usethreads exists for this script, build args array of parameters based on this scripts args
	if (hsthreads) {
		//copy hack script to this server and spawn script with threads and arguments as a single string
		if (ns.getHostname() != 'home') {
			await ns.scp('hack.js', ns.getHostname(), 'home');
		}
		ns.spawn('hack.js', hsthreads);
	}
}
