/* 
 * Initialization and rotate scripts
 *
 * elemList [HTML Collection]
 * list of HTML element to apply effect to
 *
 * scale
 * scale and max rotation of the elements
 * (Default: 10, reccomended maximum: 90)
 */
const followCursor = function (elemList, scale=10) {
    //Init
    const boxSizes = [];
    let $elems = [];

    if (Array.from !== undefined) {
        $elems = Array.from(elemList);
    } else {
        $elems = [];
        for (i = 0; i < elemList.length; i++) {
            $elems[i] = elemList[i];
        }
    }

    let counter = 0;
    let scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    rBoxes = [];
    //Applied to every element in $elems
    $elems.reduce(
        function (total, img) {
            counter += 1;

            //Bounding box
            let rBox = img;
            let relativeBox = img.getAttribute('data-relative');
            if (relativeBox !== null) {
                rBox = document.getElementById(relativeBox);
            }
            let box = rBox.getBoundingClientRect();

            //Object with data for element's position
            boxSizes[counter] = {
                left: box.left,
                width: box.width,
                top: getElemDistance(img),
                height: box.height,
                obj: img,
                classes: img.getAttribute("style"),
            }

            //Format style elements that existed before
            if (boxSizes[counter].classes === null) {
                boxSizes[counter].classes = "";
            } else {
                boxSizes[counter].classes += ";"
            }

            //Apply a counter to find key in boxSizes array
            if (relativeBox !== null) {
                dataMouseRotate = rBox.getAttribute("data-mouserotate-relative");
                if (dataMouseRotate !== null)
                    rBox.setAttribute("data-mouserotate-relative", dataMouseRotate + ',' + counter);
                else {
                    rBox.setAttribute("data-mouserotate-relative", counter);
                }
            }
            img.setAttribute("data-mouserotate", counter);

            rBoxes[counter] = rBox;
            //Applied on mouse over
        },
        0);
    rBoxes.forEach(ss);
    function ss(rBox, index) {

        rBox.onmousemove = function (e) {
            //get key
            oneCount = this.getAttribute("data-mouserotate");
            if (oneCount !== null) {
                let xPos = (e.clientX - boxSizes[oneCount].left) / boxSizes[oneCount].width;

                //Cursor's Y position in relation to the element (0-1)
                let yPos = ((scrollPos + e.clientY) - boxSizes[oneCount].top) / boxSizes[oneCount].height;

                //Rotation calculation
                let rotateY = (scale * -1) + (xPos * (scale * 2));
                let rotateX = scale - (yPos * scale * 2);

                //Limit rotation to scale
                if (rotateY > scale) {
                    rotateY = scale
                }
                if (rotateY < (scale * -1)) {
                    rotateY = (scale * -1)
                }
                if (rotateX > scale) {
                    rotateX = scale
                }
                if (rotateX < (scale * -1)) {
                    rotateX = (scale * -1)
                }
                //Apply rotation
                $elems[oneCount - 1].setAttribute("style", `${boxSizes[oneCount].classes}; ${transformCSS(boxSizes[oneCount].height, rotateX.toFixed(3), rotateY.toFixed(3))}`);
            } else {
                let allCount = this.getAttribute("data-mouserotate-relative");
                allCount = allCount.split(',');
                allCount.forEach(dd);
                function dd(d1, d2) {
                    let xPos = (e.clientX - boxSizes[d1].left / 2) / (boxSizes[d1].width);

                    //Cursor's Y position in relation to the element (0-1)
                    let yPos = ((scrollPos + e.clientY) - boxSizes[d1].top) / (boxSizes[d1].height / 3);

                    //Rotation calculation
                    let rotateY = (scale * -1) + (xPos * (scale * 2));
                    let rotateX = scale - (yPos * scale * 2);

                    //Limit rotation to scale
                    if (rotateY > scale) {
                        rotateY = scale
                    }
                    if (rotateY < (scale * -1)) {
                        rotateY = (scale * -1)
                    }
                    if (rotateX > scale) {
                        rotateX = scale
                    }
                    if (rotateX < (scale * -1)) {
                        rotateX = (scale * -1)
                    }
                    $elems[d1 - 1].setAttribute("style", `${boxSizes[d1].classes}; ${transformCSS(boxSizes[d1].height, rotateX.toFixed(3), rotateY.toFixed(3))}`);
                }
            }
        }
    }

    //Reset element's information
    //(On resize or scroll)
    const resetSizes = function () {
        boxSizes.reduce(function (total, box, i) {
                let rBox = box.obj;
                let relativeBox = box.obj.getAttribute('data-relative');
                if (relativeBox !== null) {
                    rBox = document.getElementById(relativeBox);
                }
                let boxRect = rBox.getBoundingClientRect();
                boxSizes[i].left = boxRect.left;
                boxSizes[i].width = boxRect.width;
                boxSizes[i].height = boxRect.height;
                boxSizes[i].top = getElemDistance(box.obj);
            },
            0
        );

        scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    window.onscroll = resetSizes;
    window.onresize = resetSizes;
};

//Get the absolute distance of an element
//from the top of page
const getElemDistance = function (elem) {
    let location = 0;
    if (elem.offsetParent) {
        do {
            location += elem.offsetTop;
            elem = elem.offsetParent;
        } while (elem);
    }
    return location >= 0 ? location : 0;
};

//Function to add prefixes to transform rules
const transformCSS = function (perspective, rotateX, rotateY) {
    let css = `transform: perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg);`;
    css += `-webkit-transform: perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg);`;
    css += `-moz-transform: perspective(${perspective}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg);`;
    return css;
};