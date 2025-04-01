/*
 * Copyright (c) 2021.
 */

/**
 *
 *
 * @author: Martin Neitz
 */

import ThemeBehavior            from "../../themebehavior.mjs";
import { validationLevel }      from "../../../lib/common.mjs";

export default class MaterialSection extends ThemeBehavior {

    attach(jar) {
        this.jar = jar;
        this.container = this.jar.container;


        const trigger = this.container.querySelector('.accordion-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => this.toggleSection(), false);
        }
    }

    setLabel( label ) {
        const legend = this.container.querySelector('#label');
        legend.setAttribute('label',  label);
    }

    setSummary( summary ) {
        const summaryElement     = this.container.querySelector('.legend-summary');
        summaryElement.innerHTML = summary;
    }

    toggleSection() {
        const auroraElement = this.container.querySelector('.aurora-section');
        auroraElement.classList.toggle('collapsed');
    }
}
