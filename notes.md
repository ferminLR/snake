### About the viewport

The game's viewport consist in a grid made with a HTML table. Every cell of the table correspond to a number, being the top-left cell zero and with the number increasing from de left to right and top to bottom.

	|  0  |   1   |   2   |....| width-1 |
	|width|width+1|width+2|....|2*width-1|
	|                ...                 |
	|                ...                 |
	|(height-1)*width)|...|height*width-1|

The location within the viewport of the `food` is defined by the cell's number. The `snake.body` is defined with an array in which every element is a cell number, being the first element of the array the head of the snake and the last its tail.

### Compatibility

In initializeView, a `repeat()` method has been used to create the game viewport's DOM. This method has been added in ECMAScript6 and may not be available in all browsers. The next polyfill could be used in our function:

	for(var i=1; i<=width; i++){
		row += "<td></td>";
	}
	for(var i=1; i<=height; i++){
		innerHTML += '<tr>'+row+'</tr>';
	}
	innerHTML = '<table>'+innerHTML+'</table>';

Instead of:

	row = "<td></td>".repeat(width)
	innerHTML = '<table>'+('<tr>'+row+'</tr>').repeat(height)+'</table>';