/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Bernhard Lukassen
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialSlider extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;

        this._min = 20;
        this._max = 100;

        this._isDragging = false;

        this._slider       = this.container.querySelector(".aurora-slider");
        this._sliderHandle = this.container.querySelector(".slider-handle");
        this._sliderFill   = this.container.querySelector(".slider-fill");
        this._sliderLabel  = this.container.querySelector(".slider-label span");
        this._range        = this.container.querySelector("input[type='range']");

        //---  CLICK event for the input field wrapper  ----------------------------------------------------------------
        let sliderHandle = this.container.getElementsByClassName("slider-handle");
        sliderHandle = sliderHandle[0];
        sliderHandle.addEventListener('mousedown', () => this.callbackMouseDown(), false);

        document.addEventListener('mouseup', () => this.callbackMouseUp(), false);
        document.addEventListener('mousemove', (evt) => this.callbackMouseMove(evt), false);

    }

    callbackMouseDown() {
        this._isDragging = true;
        this._slider.classList.add('active');
    }

    callbackMouseUp() {
        this._isDragging = false;
        this._slider.classList.remove('active');
    }

    callbackMouseMove(evt) {
        if ( !this._isDragging ) return;

        const rect        = this._slider.getBoundingClientRect();
        const sliderWidth = rect.width;
        const sliderX     = rect.left;
        const mouseX      = evt.clientX - sliderX;


        // If the mouse is outside the element, return the left or right position of the element

        let newHandlePosition = mouseX;

        if (mouseX < 0) {
            newHandlePosition =  0;
        } else if (mouseX > sliderWidth) {
            newHandlePosition =  sliderWidth;
        }

        const newHandlePositionPercentage = (100 / sliderWidth) * newHandlePosition;
        const newSliderValue              = ((this._max - this._min) / 100 * newHandlePositionPercentage) + this._min;

        this._sliderHandle.style.left = newHandlePositionPercentage + '%';
        this._sliderFill.style.width  = newHandlePositionPercentage + '%';

        this._sliderLabel.innerHTML = Math.round(newSliderValue);

        this._range.value( newSliderValue );
    }


    setLabel( label ) {
        const element = this.container.querySelector('.aurora-slider-label');
        element.innerHTML = label;
    }
}