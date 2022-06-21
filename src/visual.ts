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


import { VisualSettings } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (document) {
            const new_p: HTMLElement = document.createElement("p");
            new_p.appendChild(document.createTextNode("Update count:"));
            const new_em: HTMLElement = document.createElement("em");
            this.textNode = document.createTextNode(this.updateCount.toString());
            new_em.appendChild(this.textNode);
            new_p.appendChild(new_em);
            this.target.appendChild(new_p);

            // Write TypeScript code!
            //const appDiv: HTMLElement = document.getElementById('p');
            //appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

            const groups = new DataSet([
                { id: 1, content: 'Truck&nbsp;1' },
                { id: 2, content: 'Truck&nbsp;2' },
                { id: 3, content: 'Truck&nbsp;3' },
                { id: 4, content: 'Truck&nbsp;4' }
            ]);

            // Create a DataSet (allows two way data-binding)
            // create items
            const data: any = new DataSet();
            const count = 100;
            let order = 1;
            let truck = 1;
            const max: any = 0.02;

            // create 4 truck groups, then order inside each group
            for (let j = 0; j < 4; j++) {
                const date = new Date();
                for (let i = 0; i < count / 4; i++) {
                    date.setHours(date.getHours() + 4 * Math.random());
                    const start = new Date(date);

                    date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
                    const end = new Date(date);

                    data.add({
                        id: order,
                        group: truck,
                        start,
                        end,
                        content: 'Order ' + order
                    });

                    order++;
                }
                truck++;
            }

            const options = {
                stack: false,
                start: new Date(),
                end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
                editable: true,
                margin: {
                    item: 10, // minimal margin between items
                    axis: 5 // minimal margin between items and the axis
                },
                orientation: 'top'
            };

            const timeline = new Timeline(new_p, null, options);
            timeline.setGroups(groups);
            timeline.setItems(data);

        }
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        let dataView: DataView = options.dataViews[0];
        //debugger;
        
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