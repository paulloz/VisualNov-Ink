import { EventDispatcher, IEvent } from "strongly-typed-events";
import { Point } from "./point";

export class Canvas {
    private element : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;

    private _onClick : EventDispatcher<Canvas, Point> = new EventDispatcher<Canvas, Point>();

    constructor(container_id : string, width : number, height : number) {
        const container = document.getElementById(container_id);

        if (container.tagName == "canvas") {
            this.element = <HTMLCanvasElement> container;
        } else {
            this.element = document.createElement("canvas");
            container.appendChild(this.element);
        }

        this.element.width = width;
        this.element.height = height;
        this.element.style.border = "1px solid black";

        this.ctx = this.element.getContext("2d");
        if (!this.ctx) {
        }

        this.element.addEventListener("click", this._click.bind(this));

        this.Clear();
    }

    get Size() : Point {
        return new Point(this.element.width, this.element.height);
    }

    Clear() : void {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }

    Translate(position : Point) : void {
        this.Restore();
        this.ctx.save();
        this.ctx.translate(position.X, position.Y);
    }

    Restore() : void {
        this.ctx.restore();
    }

    DrawRect0(size : Point, color : string) : void {
        this.DrawRect(new Point(), size, color);
    }

    DrawRect(position : Point, size : Point, color : string) : void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.X, position.Y, size.X, size.Y);
    }

    DrawText0(text : string, color : string, maxWidth? : number) : void {
        this.DrawText(text, new Point(), color, maxWidth);
    }

    DrawText(text : string, position : Point, color : string, maxWidth? : number) : void {
        this.ctx.fillStyle = color;
        this.ctx.font = "24px sans-serif";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(text, position.X, position.Y, maxWidth);
    }

    get OnClick() : IEvent<Canvas, Point> {
        return this._onClick.asEvent();
    }

    private _click(ev : MouseEvent) : void {
        let clickPosition : Point = new Point(
            ev.pageX - this.element.offsetLeft,
            ev.pageY - this.element.offsetTop
        );
        this._onClick.dispatchAsync(this, clickPosition);
    }
}