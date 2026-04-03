const { app, Tray, Menu, dialog } = require('electron');
const applescript = require('applescript');

const client = new (require('discord-rpc-revamp').Client)();
client.connect({ clientId: '1248757605267013698' }).catch(console.error);

let curPlaying = null;
let paused = false;

const run = () => {
    applescript.execString(`
        tell application "Music"
            try
                if exists current track then
                    set trackName to name of current track
                    set artistName to artist of current track
                    set albumName to album of current track
                    set trackID to persistent ID of current track
                    set currentPosition to player position
                    set trackDuration to duration of current track
                    set isPaused to (player state is paused)
                    return {trackName, artistName, albumName, trackID, trackDuration, currentPosition, isPaused}
                else
                    return "No track is currently playing."
                end if
            on error errMsg number errNum
                return "Error: " & errMsg & " (" & errNum & ")"
            end try
        end tell
    `, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log(result);

        if (result === "No track is currently playing.") {
            console.log("No track is currently playing.");
            return;
        }

        const [trackName, artistName, albumName, trackID, trackDuration, currentPosition, isPaused] = result;

        if (isPaused === 'true') {
            if (trackID === curPlaying && paused) return;
            console.log("Paused");
            paused = true;
            client.setActivity({
                details: trackName,
                state: `${artistName} - ${albumName}`.substring(0, 128),
                smallImageKey: 'paused',
                smallImageText: 'Paused',
                largeImageKey: 'music',
                largeImageText: "Apple Music",
            }).then(() => console.log('Activity set to paused')).catch(console.error);
        } else {
            console.log("Unpaused");
            paused = false;
            if (trackID === curPlaying && paused) return console.log("Already playing");
            const remainingTime = trackDuration - currentPosition;
            const endTime = Date.now() + remainingTime * 1000;
            client.setActivity({
                details: trackName,
                state: `${artistName} - ${albumName}`.substring(0, 128),
                endTimestamp: endTime,
                largeImageKey: 'music',
                largeImageText: "Apple Music",
            }).then(() => console.log('Activity set to playing')).catch(console.error);
        }
        curPlaying = trackID;
    });
}

app.on('before-quit', () => {
    client.destroy();
});

app.on('ready', () => {
    run();
    setInterval(run, 1000);
    app.dock.hide();
    try {
        const t = new Tray(require('path').join(__dirname, 'icon.png'));
        t.setToolTip('Apple Music RPC');
        t.setContextMenu(Menu.buildFromTemplate([
            { label: "Apple Music RPC", enabled: false },
            { label: 'Quit', click: () => app.quit() },
            { label: "Credits", click: () => dialog.showMessageBox({ title: "Credits", message: "Made with Electron, discord-rpc-revamp, AppleScript, and an icon from Google Material Icons." }) }
        ]));
    } catch (e) {
        console.error(e);
    }
});