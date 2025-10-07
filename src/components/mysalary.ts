import { ref } from "vue";

export default function () {
    const userName = ref('roy');
    const salary = ref(15000);
    
    function addSalary() {
        salary.value += 1000;
        console.log(salary);
    }
    
    return {userName, salary, addSalary};
}

interface Point {
  x: number;
  y: number;
}
 
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

function printId(id: Point) {
 console.log(id);
}