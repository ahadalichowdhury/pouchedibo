import Swal from 'sweetalert2';
import {updateStatusRequest} from "../ApiRequest/APIReguest";

export function updateToDo(id, status){
    return Swal.fire({
        title: "change Status",
        input: "select",
        inputOptions: {New: "New", Progress: "Progress", Completed: "Completed", Canceled:"Canceled" },
        inputValue: status,
    }).then((result) => {
       return updateStatusRequest(id, result.value).then((result) => {
           return result;
       })
    });
}