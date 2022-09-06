import{ensureOptions as n}from"./dragdrop-manager/options.js";import{applyPlaceholder as o}from"./dragdrop-manager/placeholder-type.js";import{performDrop as r}from"./dragdrop-manager/perform-drop.js";import{startDrag as i,updateDrag as a}from"./dragdrop-manager/drag.js";class _{constructor(e,s){this._element=e,this._options=n(s),this._mouseDownHandler=this.mouseDown.bind(this),this._mouseMoveHandler=this.mouseMove.bind(this),this._mouseUpHandler=this.mouseUp.bind(this),this._mouseOverHandler=this.mouseOver.bind(this),this._element.addEventListener("mousedown",this._mouseDownHandler)}dispose(){this._element.removeEventListener("mousedown",this._mouseDownHandler),this._mouseDownHandler=null,this._mouseMoveHandler=null,this._mouseUpHandler=null,this._mouseOverHandler=null}async mouseDown(e){e.preventDefault(),this._startPoint={x:e.clientX,y:e.clientY},this._movePoint={x:e.clientX,y:e.clientY};const s=l(e,this._options);s!=null&&(this._dragElement=s,this._placeholder=await o(s,this._options),await i(this._dragElement),document.addEventListener("mousemove",this._mouseMoveHandler),document.addEventListener("mouseup",this._mouseUpHandler),this._updateDragHandler=a.bind(this),this._updateDragHandler())}async mouseMove(e){e.preventDefault(),this._movePoint.x=e.clientX,this._movePoint.y=e.clientY}async mouseUp(e){e.preventDefault(),this._updateDragHandler=null,this._movePoint=null,this._startPoint=null,document.removeEventListener("mousemove",this._mouseMoveHandler),document.removeEventListener("mouseup",this._mouseUpHandler),await r(this._dragElement,this._placeholder,this._options),delete this._dragElement,delete this._placeholder}async mouseOver(e){}}function l(t,e){return t.target.matches(e.dragQuery)?t.target:t.target.parentElement?.matches(e.dragQuery)?t.target.parentElement:null}export{_ as DragDropManager};
