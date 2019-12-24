import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";
import "../../../node_modules/noty/lib/themes/mint.css";
export function notification(type, message){
    new Noty({
        text: message,
        type: type,
        timeout: 4000
        //"alert", "error", "info", "information", "success", "warning"
    }).show();
}
