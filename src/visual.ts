/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { Timeline, TimelineOptions, DataItem, DataSet } from "vis-timeline/standalone";

import ISelectionManager = powerbi.extensibility.ISelectionManager; // added for selections
import ISelectionId = powerbi.visuals.ISelectionId; //added for selections
import IVisualHost = powerbi.extensibility.visual.IVisualHost; // added for selections


import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;


    private host: IVisualHost; //added for selections    
    private selectionManager: ISelectionManager; //added for selections    

    constructor(options: VisualConstructorOptions) {
        this.host = options.host; //added for selections        
        this.selectionManager = this.host.createSelectionManager(); // added for selections
        console.log('Visual constructor', options);
        this.target = options.element;
        const new_p: HTMLElement = document.createElement("div");
        new_p.id = "visualization";
        this.target.appendChild(new_p);
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        let dataView: DataView = options.dataViews[0];
        
        // categories
        const categories = dataView.categorical.categories;
        // get count of category elements
        const categoriesCount = categories[0].values.length;
        let selectionManager = this.selectionManager; // for selections

        if (document) {

            const tldata: any = new DataSet();

            for (let j = 0; j < categoriesCount; j++) {
                let categorySelectionId = this.host.createSelectionIdBuilder()
                    .withCategory(categories[0], j) 
                    .createSelectionId();

                tldata.add({
                    id: categories[0].values[j],
                    start: categories[1].values[j],
                    end: categories[2].values[j],
                    content: categories[3].values[j],
                    style: categories[4].values[j],
                    sid: categorySelectionId
                });
            }
           
            // reset, clean
            var e = document.querySelector("div");
            e.innerHTML = "";
            
            const options = {
                margin: {
                    item: 10, // minimal margin between items
                    axis: 5 // minimal margin between items and the axis
                },
                orientation: 'top'
            };

            const timeline = new Timeline(e, null, options);            
            timeline.setItems(tldata);
            // https://www.google.com/search?q=document.querySelectorAll(+add+mouse+click+event+function&rlz=1C1JZAP_en&oq=document.querySelectorAll(+add+mouse+click+event+function&aqs=chrome..69i57j33i160.6789j0j1&sourceid=chrome&ie=UTF-8
            // https://stackoverflow.com/questions/21700364/adding-click-event-listener-to-elements-with-the-same-class
            var d = document.querySelectorAll(".vis-item");
            
            d.forEach(function (el) {
                el.addEventListener('click', function emit(event) {
                    // noticed the bold dom properties, https://www.google.com/search?q=property+in+bold+dev+tools&rlz=1C1JZAP_en&oq=property+in+bold+dev+tools&aqs=chrome..69i57j33i10i160j33i22i29i30.5500j0j1&sourceid=chrome&ie=UTF-8
                    // the vis-item is a own property of the DOM, https://developer.chrome.com/docs/devtools/dom/properties/#own-and-inherited
                    https://www.google.com/search?q=print+properties+of+element&rlz=1C1JZAP_en&oq=print+properties+of+element&aqs=chrome..69i57j33i10i160l3j33i22i29i30l6.4081j0j1&sourceid=chrome&ie=UTF-8
                    // read the attributes, https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
                    //console.log(el.attributes); // then copy path                    
                            console.log(this.attributes);
                    selectionManager.select(this.attributes[0].ownerElement["vis-item"].data.sid)
                });
            })
        }

        if (this.textNode) {
            this.textNode.textContent = (this.updateCount++).toString();
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}