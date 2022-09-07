import{ensureOptions as s}from"./dragdrop-manager/options.js";import{applyPlaceholder as i}from"./dragdrop-manager/placeholder.js";import{drop as o}from"./dragdrop-manager/drop.js";import{startDrag as n,updateDrag as r}from"./dragdrop-manager/drag.js";import{getDraggable as l}from"./drag-utils.js";class p{constructor(e,t){this._element=e,this._options=s(t),this._mouseDownHandler=this.mouseDown.bind(this),this._mouseMoveHandler=this.mouseMove.bind(this),this._mouseUpHandler=this.mouseUp.bind(this),this._mouseOverHandler=this.mouseOver.bind(this),this._element.addEventListener("mousedown",this._mouseDownHandler)}dispose(){this._element.removeEventListener("mousedown",this._mouseDownHandler),this._mouseDownHandler=null,this._mouseMoveHandler=null,this._mouseUpHandler=null,this._mouseOverHandler=null}async mouseDown(e){if(e.preventDefault(),this._isBusy==!0)return;this._startPoint={x:e.clientX,y:e.clientY},this._movePoint={x:e.clientX,y:e.clientY};const t=l(e,this._options);t!=null&&(this._dragElement=t,this._placeholder=await i(t,this._options),await n(this._dragElement,this._options),document.addEventListener("mousemove",this._mouseMoveHandler),document.addEventListener("mouseup",this._mouseUpHandler),this._updateDragHandler=r.bind(this),this._updateDragHandler())}async mouseMove(e){e.preventDefault(),this._movePoint.x=e.clientX,this._movePoint.y=e.clientY}async mouseUp(e){this._isBusy=!0,e.preventDefault(),this._updateDragHandler=null,this._movePoint=null,this._startPoint=null,document.removeEventListener("mousemove",this._mouseMoveHandler),document.removeEventListener("mouseup",this._mouseUpHandler),await o(this._dragElement,this._placeholder,this._options),delete this._dragElement,delete this._placeholder,this._isBusy=!1}async mouseOver(e){}}export{p as DragDropManager};
