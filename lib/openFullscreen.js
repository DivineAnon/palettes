export default function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen({ navigationUI: "show" });
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
}