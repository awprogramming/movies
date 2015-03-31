/***************************************************************
*  Copyright notice
*
*  (c) 2014 PF bioinformatique de Toulouse
*  All rights reserved
* 
*
*  This script is an adaptation of the venny script developed by
*  Juan Carlos Oliveros, BioinfoGP, CNB-CSIC:
*  Oliveros, J.C. (2007) VENNY. An interactive tool for comparing 
*  lists with Venn Diagrams.
*  http://bioinfogp.cnb.csic.es/tools/venny/index.html.
*  It is distributed under the terms of the GNU General Public 
*  License as published by the Free Software Foundation; either 
*  version 2 of the License, or (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
(function($) {
	$.fn.jvenn = function(options) {
        var defaults = {
            series: [{
            	name: 'Actors',
            	data: ["Marilyn Monroe", "Arnold Schwarzenegger", "Jack Nicholson", "Barbra Streisand", "Robert de Niro", "Dean Martin", "Harrison Ford"]
            }, {
            	name: 'Singers',
            	data: ["Freddy Mercury", "Barbra Streisand", "Dean Martin", "Ricky Martin", "Celine Dion", "Marilyn Monroe"]
            }],
//            series: [{
//            	name: 'sample1',
//            	data: ["Otu1", "Otu2", "Otu3", "Otu4", "Otu5", "Otu6", "Otu7"],
//            	values: [5, 15, 250, 20, 23, 58, 89]
//            }, {
//            	name: 'sample2',
//            	data: ["Otu1", "Otu2", "Otu5", "Otu7", "Otu8", "Otu9"],
//            	values: [90, 300, 10, 2, 45, 9]
//            }],
//            series: [{
//            	name: {A: 'Actors',
//                     B: 'Singers'},
//            	data: {A: ["Arnold Schwarzenegger", "Jack Nicholson", "Robert de Niro", "Harrison Ford"], B: ["Freddy Mercury", "Ricky Martin", "Celine Dion"], AB: ["Marilyn Monroe", "Barbra Streisand", "Dean Martin"]},
//            	values: {A: 4, B: 3, AB: 3}
//            }],
            fnClickCallback: function() {
            	var value = "";
            	if (this.listnames.length == 1) {
            		value += "Elements only in ";
            	} else {
            		value += "Common elements in ";
            	}
            	for (name in this.listnames) {
            		value += this.listnames[name] + " ";
            	}
            	value += ":\n";
            	for (val in this.list) {
            		value += this.list[val] + "\n";
            	}
            	alert(value);
            },
            disableClick: false,
            useValues: false,
            exporting: true,
            displayMode: 'classic',
            displayStat: false,
            shortNumber: true,
            searchInput: null,
            searchStatus: null,
            searchMinSize:1,
            // Colors must be RGB
            //       green         , blue            , red            , yellow          , orange         , brown
            colors: ["rgb(0,102,0)","rgb(90,155,212)","rgb(241,90,96)","rgb(250,220,91)","rgb(255,117,0)","rgb(192,152,83)"]
        };  
		var opts = $.extend(defaults, options); 
		
		function drawEllipse(x, y, r, w, h, a, fillcolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			context.beginPath();
			context.save();
			context.translate(x, y);
			context.rotate(a*Math.PI/180);
			context.scale(w, h);
			context.arc(0, 0, r, 0, Math.PI * 2);
			context.fillStyle = fillcolor;
			context.fill();
			context.restore();
		};
		
		function drawTriangle(x1, y1, x2, y2, x3, y3, fillcolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			context.beginPath();
			context.save();
			context.moveTo(x1,y1);
		    context.lineTo(x2,y2);
		    context.lineTo(x3,y3);
			context.fillStyle = fillcolor;
			context.fill();
			context.restore();
		};
		
		function drawLine(x1, y1, x2, y2, strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
		    context.lineWidth = 1;
		    context.beginPath();
		    context.moveTo(x1, y1);
		    context.lineTo(x2, y2);
			context.strokeStyle = strokecolor;
		    context.stroke();
		};
		
		function drawCircle(x, y, r, w, h, a, strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			context.beginPath();
			context.save();
			context.translate(x, y);
			context.rotate(a*Math.PI/180);
			context.scale(w, h);
			context.arc(0, 0, r, 0, Math.PI * 2);
		    context.lineWidth = 3;
			context.strokeStyle = strokecolor;
		    if(getOpacity(strokecolor) >= 0.6) {  // strokecolor must be rgba
			    context.fillStyle = changeOpacity(strokecolor, 0.1);
				context.fill();
		    }
		    context.stroke();
			context.restore();
		};
		
		function drawDoubleCircle(strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			var counterClockwise = false;
			
			context.strokeStyle = strokecolor;
			context.lineWidth = 3;
			// Circles
			context.beginPath();
			context.arc(120, 205, 90, 0.25 * Math.PI, 1.75 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(370, 205, 90, 1.25 * Math.PI, 0.75 * Math.PI, counterClockwise);
		   	context.stroke();
			// Arcs
			context.beginPath();
			context.arc(245, 360, 110, 1.3 * Math.PI,  1.7 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(245, 50, 110, 0.3 * Math.PI,  0.7 * Math.PI, counterClockwise);
			context.stroke();
			// Fill if hover
			if(getOpacity(strokecolor) >= 0.6) {  // strokecolor must be rgba
	    		context.save();
	    		context.beginPath();
	    		context.moveTo(0,0);
	    		context.lineTo(500,0);
	    		context.lineTo(500,415);
	    		context.lineTo(0,415);
	    		context.closePath();
	    		context.clip();
	    		context.strokeStyle = 'rgba(0,0,0,0)';
	    		context.lineCap = 'butt';
	    		context.lineJoin = 'miter';
	    		context.miterLimit = 4;
	    		context.save();
	    		context.restore();
	    		context.save();
	    		context.restore();
	    		context.save();
	    		context.translate(-11,-633);
	    		context.save();
	    		context.strokeStyle = 'rgba(0,0,0,0)';
	    		context.translate(0,636);
	    		context.beginPath();
	    		context.moveTo(116.68996,288.55847);
	    		context.bezierCurveTo(114.18984,288.06339,109.64415,287.21717,106.58843999999999,286.67797);
	    		context.bezierCurveTo(91.905866,284.08711,74.873379,272.58587,62.202665,256.70632);
	    		context.bezierCurveTo(50.11906,241.56257,44.228048,226.01748,43.257799,206.71498);
	    		context.bezierCurveTo(41.560634,172.95091,57.502272,144.04252,87.68464900000001,126.1518);
	    		context.bezierCurveTo(113.85468,110.63942,151.67555000000002,111.15554999999999,176.27348,127.36075);
	    		context.bezierCurveTo(180.25579000000002,129.9843,185.18402,133.59167,187.22511,135.37712);
	    		context.bezierCurveTo(194.61144,141.83832999999998,205.94366,148.05088999999998,218.69964,152.63209999999998);
	    		context.bezierCurveTo(245.95179,162.41950999999997,276.56952,161.09978999999998,302.53531,149.01852999999997);
	    		context.bezierCurveTo(312.66749999999996,144.30425999999997,319.21466,140.23029999999997,324.17127999999997,135.55560999999997);
	    		context.bezierCurveTo(333.89739,126.38270999999997,351.79472999999996,118.14201999999997,367.20779999999996,115.73977999999997);
	    		context.bezierCurveTo(378.37728999999996,113.99892999999997,395.02293999999995,115.10837999999997,406.09866999999997,118.33190999999997);
	    		context.bezierCurveTo(427.39104999999995,124.52893999999996,447.81205,140.89770999999996,458.49307999999996,160.32946999999996);
	    		context.bezierCurveTo(466.21541999999994,174.37854999999996,468.14135,182.79986999999997,468.18706999999995,202.71742999999995);
	    		context.bezierCurveTo(468.21646999999996,215.53506999999996,467.84246999999993,219.76843999999994,466.13687999999996,225.92328999999995);
	    		context.bezierCurveTo(460.34646999999995,246.81870999999995,443.97394999999995,267.47014999999993,423.77633999999995,279.35468999999995);
	    		context.bezierCurveTo(411.54527999999993,286.55159999999995,399.98404999999997,289.09283999999997,379.83469999999994,289.01338999999996);
	    		context.bezierCurveTo(354.90229999999997,288.91508999999996,338.08241999999996,282.66270999999995,322.01485999999994,267.52031999999997);
	    		context.bezierCurveTo(312.0940299999999,258.17073,292.45028999999994,249.89035999999996,272.32759999999996,246.57576999999998);
	    		context.bezierCurveTo(254.94397999999995,243.71236999999996,234.25916999999995,245.61216,218.58554999999996,251.51169);
	    		context.bezierCurveTo(206.28085999999996,256.14317,191.57338999999996,264.45267,188.72360999999995,268.38324);
	    		context.bezierCurveTo(186.89117999999996,270.91063,172.96095999999994,280.26608,166.96462999999994,282.99643);
	    		context.bezierCurveTo(164.03704999999994,284.32946999999996,158.23248999999996,286.16623,154.06560999999994,287.07811999999996);
	    		context.bezierCurveTo(145.28290999999993,289.00015999999994,123.31454999999994,289.87026999999995,116.68995999999993,288.55846999999994);
	    		context.lineTo(116.68995999999993,288.55846999999994);
	    		context.closePath();
			    context.fillStyle = changeOpacity(strokecolor, 0.1);  // strokecolor must be rgba
	    		context.fill();
	    		context.stroke();
	    		context.restore();
	    		context.restore();
	    		context.restore();
		    }
		};
		
		function drawCross(strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			var counterClockwise = false;
			
			context.strokeStyle = strokecolor;
			context.lineWidth = 3;
			context.beginPath();
			context.arc(145, 205, 40, 0.35 * Math.PI, 1.65 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(345, 205, 40, 1.35 * Math.PI, 0.65 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(245, 100, 40, 0.8 * Math.PI, 2.2 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(245, 310, 40, 1.82 * Math.PI, 1.18 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(182, 140, 35, 1.84 * Math.PI, 0.7 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(308, 140, 35, 0.3 * Math.PI, 1.18 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(182, 270, 35, 1.3 * Math.PI, 0.2 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(308, 270, 35, 0.8 * Math.PI, 1.7 * Math.PI, counterClockwise);
			context.stroke();
			// Fill if hover
			if(getOpacity(strokecolor) >= 0.6) {  // strokecolor must be rgba
				context.save();
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(500,0);
				context.lineTo(500,415);
				context.lineTo(0,415);
				context.closePath();
				context.clip();
				context.strokeStyle = 'rgba(0,0,0,0)';
				context.lineCap = 'butt';
				context.lineJoin = 'miter';
				context.miterLimit = 4;
				context.save();
				context.restore();
				context.save();
				context.restore();
				context.save();
				context.translate(-140,-212);
				context.save();
				context.strokeStyle = 'rgba(0,0,0,0)';
				context.translate(139,217);
				context.beginPath();
				context.moveTo(234.95394,341.16933);
				context.bezierCurveTo(231.80731999999998,340.135,227.61570999999998,338.28931,225.63925999999998,337.0678);
				context.bezierCurveTo(221.28248999999997,334.37516999999997,214.37806999999998,326.70736999999997,211.83772,321.74032);
				context.bezierCurveTo(207.9414,314.12196,208.45042999999998,293.37118,212.67719,287.51943);
				context.bezierCurveTo(215.87649,283.09018,218.95801,274.65101,219.59244,268.58113);
				context.bezierCurveTo(220.45250000000001,260.35249,218.0029,251.63114999999996,212.48275,243.26837999999998);
				context.bezierCurveTo(206.02273000000002,233.48175999999998,198.89664000000002,229.43794999999997,185.95006,228.21201);
				context.bezierCurveTo(178.17816000000002,227.47606,172.06373000000002,228.9391,162.89332000000002,233.72894);
				context.bezierCurveTo(156.28128,237.18251999999998,155.23208000000002,237.42228,146.73088,237.42244);
				context.bezierCurveTo(135.51808000000003,237.42266,128.41302000000002,234.90269,121.10778000000002,228.33465999999999);
				context.bezierCurveTo(114.30638000000002,222.21962,111.33466000000001,216.76216,109.78745000000002,207.54525999999998);
				context.bezierCurveTo(108.21951000000003,198.20489999999998,109.69855000000003,187.35654,113.42449000000002,180.86914);
				context.bezierCurveTo(116.70310000000002,175.16054,123.50535000000002,169.17129,130.61112000000003,165.73660999999998);
				context.bezierCurveTo(135.84135000000003,163.2085,137.81975000000003,162.82216,145.72073000000003,162.78605);
				context.bezierCurveTo(154.43018000000004,162.74624999999997,155.21524000000002,162.9348,164.40855000000002,167.27446999999998);
				context.bezierCurveTo(173.55745000000002,171.59319999999997,174.43144,171.80518999999998,183.14876,171.82016);
				context.bezierCurveTo(191.71748000000002,171.83496,192.78155,171.59418,200.06856000000002,167.99274);
				context.bezierCurveTo(206.71571000000003,164.70754,208.40559000000002,163.31437,211.70876,158.39629);
				context.bezierCurveTo(216.86766,150.71523,219.00004,144.97677,219.64970000000002,137.02646);
				context.bezierCurveTo(220.25703000000001,129.59413999999998,217.81806000000003,120.60798999999999,213.36866000000003,113.88449999999999);
				context.bezierCurveTo(208.31047000000004,106.24103999999998,207.60430000000002,86.789031,212.06743000000003,78.04059099999999);
				context.bezierCurveTo(215.36468000000002,71.57742099999999,222.48250000000002,64.79066099999999,229.83172000000002,61.10251999999999);
				context.bezierCurveTo(236.05208000000002,57.98088699999999,237.41276000000002,57.68862899999999,245.72583000000003,57.68862899999999);
				context.bezierCurveTo(253.41441000000003,57.68862899999999,255.67446000000004,58.09343499999999,260.37304,60.31215099999999);
				context.bezierCurveTo(277.08479,68.203604,286.51407,86.23497699999999,282.57463,102.76767);
				context.bezierCurveTo(281.86319000000003,105.75339,279.29147,112.06009,276.85971,116.78255);
				context.bezierCurveTo(273.65874,122.99881,272.27383000000003,127.0461,271.84239,131.44528);
				context.bezierCurveTo(270.33639000000005,146.80139,279.61874,162.9296,293.20300000000003,168.5596);
				context.bezierCurveTo(306.55802000000006,174.09458999999998,314.0903,173.65240999999997,329.06341000000003,166.45448);
				context.bezierCurveTo(336.00568000000004,163.11717,337.40021,162.8096,345.73093000000006,162.77846);
				context.bezierCurveTo(353.96010000000007,162.74776,355.45355000000006,163.05339,361.47832000000005,166.00153);
				context.bezierCurveTo(369.53210000000007,169.94254,376.64791,177.20452,380.3403400000001,185.25103000000001);
				context.bezierCurveTo(382.5644300000001,190.09773,382.9971500000001,192.49377,383.0256800000001,200.12014000000002);
				context.bezierCurveTo(383.0562800000001,208.31117000000003,382.74275000000006,209.86176000000003,379.8593200000001,215.77750000000003);
				context.bezierCurveTo(376.0651900000001,223.56169000000003,370.1637800000001,229.56756000000004,362.0334900000001,233.91890000000004);
				context.bezierCurveTo(351.4550500000001,239.58048000000002,339.7398500000001,239.17006000000003,326.6582200000001,232.67959000000005);
				context.bezierCurveTo(310.6073100000001,224.71590000000003,294.4869300000001,227.24494000000004,281.98739000000006,239.68774000000005);
				context.bezierCurveTo(270.03863000000007,251.58229000000006,268.4080000000001,270.18789000000004,277.92910000000006,285.99336000000005);
				context.bezierCurveTo(284.3299400000001,296.61906000000005,285.13914000000005,307.05507000000006,280.51249000000007,319.31069);
				context.bezierCurveTo(277.5959900000001,327.03626,268.9701400000001,335.93369,260.6715500000001,339.77631);
				context.bezierCurveTo(253.04107000000008,343.30956000000003,243.1026400000001,343.84789,234.95394000000007,341.16933);
				context.lineTo(234.95394000000007,341.16933);
				context.closePath();
			    context.fillStyle = changeOpacity(strokecolor, 0.1);  // strokecolor must be rgba
				context.fill();
				context.stroke();
				context.restore();
				context.restore();
				context.restore();
		    }
		};
		
		function drawCross2(strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			var counterClockwise = false;
			
			context.strokeStyle = strokecolor;
			context.lineWidth = 3;
			context.beginPath();
			context.arc(151, 205, 18, 0.4 * Math.PI, 1.6 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(167, 238, 18, 1.35 * Math.PI, 2.42 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(180, 272, 18, 0.18 * Math.PI, 1.33 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(212, 289, 18, 1.15 * Math.PI, 2.1 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(245, 302, 18, 1.85 * Math.PI, 1.15 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(279, 289, 18, 0.87 * Math.PI, 1.85 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(311, 272, 18, 1.65 * Math.PI, 0.85 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(325, 238, 18, 0.54 * Math.PI, 1.68 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(340, 205, 18, 1.37 * Math.PI, 0.59 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(325, 172, 18, 0.35 * Math.PI, 1.4 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(311, 138, 18, 1.15 * Math.PI, 2.35 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(279, 122, 18, 0.17 * Math.PI, 1.1 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(245, 108, 18, 0.8 * Math.PI, 2.15 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(212, 122, 18, 1.9 * Math.PI, 0.85 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(180, 138, 18, 0.65 * Math.PI, 1.85 * Math.PI, counterClockwise);
			context.stroke();
			context.beginPath();
			context.arc(167, 172, 18, 1.6 * Math.PI, 0.7 * Math.PI, counterClockwise);
			context.stroke();
			// Fill if hover
		    if(getOpacity(strokecolor) >= 0.6) {  // strokecolor must be rgba
				context.save();
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(500,0);
				context.lineTo(500,415);
				context.lineTo(0,415);
				context.closePath();
				context.clip();
				context.strokeStyle = 'rgba(0,0,0,0)';
				context.lineCap = 'butt';
				context.lineJoin = 'miter';
				context.miterLimit = 4;
				context.save();
				context.restore();
				context.save();
				context.restore();
				context.save();
				context.translate(-4,-637);
				context.save();
				context.strokeStyle = 'rgba(0,0,0,0)';
				context.translate(0,637);
				context.beginPath();
				context.moveTo(242.80929,316.76895);
				context.bezierCurveTo(239.2558,315.3947,234.83257,308.84895,234.18254000000002,304.00262000000004);
				context.bezierCurveTo(233.85998,301.59777,234.27994,298.62012000000004,235.27891000000002,296.22928);
				context.bezierCurveTo(237.39948,291.15406,237.29592000000002,285.99823000000004,234.97058,280.87787000000003);
				context.bezierCurveTo(231.58546,273.42388000000005,224.01393000000002,268.42150000000004,216.05280000000002,268.37923);
				context.bezierCurveTo(210.33377000000002,268.34883,202.51030000000003,272.78013,198.27794000000003,278.44704);
				context.bezierCurveTo(196.41545000000002,280.94083,193.36619000000002,284.00917000000004,191.50181000000003,285.26557);
				context.bezierCurveTo(180.81154000000004,292.46974,165.85368000000003,281.37461,168.71196000000003,268.36097);
				context.bezierCurveTo(169.66342000000003,264.02899,174.42957000000004,258.84685,179.89636000000004,256.20042);
				context.bezierCurveTo(188.48844000000005,252.04107000000002,193.00795000000005,242.34352,190.58184000000006,233.27254000000002);
				context.bezierCurveTo(189.87870000000007,230.64358000000001,188.21908000000005,227.07100000000003,186.89381000000006,225.33348);
				context.bezierCurveTo(182.51221000000007,219.58889000000002,172.48125000000005,216.46373,166.00572000000005,218.82574);
				context.bezierCurveTo(160.88401000000005,220.69395,153.47334000000006,221.17446999999999,149.58323000000004,219.89061);
				context.bezierCurveTo(147.65941000000004,219.25570000000002,144.69894000000005,217.15717,143.00442000000004,215.22721);
				context.bezierCurveTo(140.25313000000003,212.09367,139.92347000000004,211.02317000000002,139.92347000000004,205.22251);
				context.bezierCurveTo(139.92347000000004,199.42185,140.25313000000003,198.35135,143.00442000000004,195.21781);
				context.bezierCurveTo(148.08184000000003,189.43495,155.59116000000003,188.31217999999998,166.73325000000003,191.66995999999997);
				context.bezierCurveTo(171.89873000000003,193.22662999999997,176.76581000000002,192.32402999999996,182.19737000000003,188.80213999999998);
				context.bezierCurveTo(186.99980000000002,185.68819,191.44125000000003,178.0236,191.44125000000003,172.85002999999998);
				context.bezierCurveTo(191.44125000000003,165.91124999999997,187.02605000000003,157.91411999999997,181.72540000000004,155.25199999999998);
				context.bezierCurveTo(168.68097000000003,148.70074999999997,164.62205000000003,137.69753999999998,171.78539000000004,128.30592);
				context.bezierCurveTo(178.71368000000004,119.22245999999998,190.67567000000003,120.01398999999998,197.23888000000002,129.99017999999998);
				context.bezierCurveTo(204.51058000000003,141.04331,214.32951000000003,144.72351999999998,224.37555000000003,140.16123);
				context.bezierCurveTo(235.23365000000004,135.23013999999998,238.86734000000004,125.44275999999999,234.78543000000002,112.12207);
				context.bezierCurveTo(233.16446000000002,106.83225999999999,234.54797000000002,101.56208,238.76789000000002,96.95178);
				context.bezierCurveTo(248.33151000000004,86.503446,267.39820000000003,96.55735,264.708,110.63005);
				context.bezierCurveTo(262.24834000000004,123.49681,263.43732,130.24138,269.17704000000003,135.9811);
				context.bezierCurveTo(273.84920000000005,140.65326,279.80664,142.46487,287.54524000000004,141.56671);
				context.bezierCurveTo(290.80029,141.18892,293.25246000000004,140.53831,292.99449000000004,140.12091);
				context.bezierCurveTo(292.73652000000004,139.70352,293.68403000000006,138.74196,295.10007,137.98412000000002);
				context.bezierCurveTo(296.51611,137.22628000000003,298.81193,134.66566000000003,300.2019,132.29385000000002);
				context.bezierCurveTo(303.47878000000003,126.70229000000002,307.77937000000003,123.14413000000002,312.28166000000004,122.29950000000002);
				context.bezierCurveTo(323.19238000000007,120.25263000000002,332.5219000000001,130.29284,330.36964000000006,141.76535);
				context.bezierCurveTo(329.6006300000001,145.86456,323.8285400000001,152.29884,317.5065000000001,156.10419000000002);
				context.bezierCurveTo(312.2969800000001,159.23989,308.17124000000007,167.72107000000003,308.8642700000001,173.86973);
				context.bezierCurveTo(309.6787300000001,181.09556,313.7704700000001,186.95133,320.2047800000001,190.09934);
				context.bezierCurveTo(326.1904100000001,193.02784000000003,330.20042000000007,193.13284000000002,338.9627100000001,190.59052000000003);
				context.bezierCurveTo(344.9917000000001,188.84125000000003,350.1988400000001,189.89377000000002,354.59001000000006,193.74927000000002);
				context.bezierCurveTo(368.2933100000001,205.78092000000004,353.68808000000007,226.52374000000003,336.55395000000004,219.36465);
				context.bezierCurveTo(323.93852000000004,214.09358,308.93266000000006,224.16784,308.71798000000007,238.05247);
				context.bezierCurveTo(308.6646800000001,241.50290999999999,311.2253800000001,248.07176,313.86683000000005,251.26035);
				context.bezierCurveTo(314.59179000000006,252.13548,316.54865000000007,253.7222,318.21540000000005,254.7864);
				context.bezierCurveTo(324.03371000000004,258.50135,328.85284000000007,263.67991,329.97401,267.42204);
				context.bezierCurveTo(332.95992,277.3881,325.11943,287.55831,314.45977000000005,287.54616999999996);
				context.bezierCurveTo(309.88386,287.54116999999997,305.3854400000001,284.53792999999996,300.84666000000004,278.45842999999996);
				context.bezierCurveTo(295.84636000000006,271.76072,288.36647000000005,267.87215,281.88796,268.60236999999995);
				context.bezierCurveTo(274.64614,269.41862999999995,268.80722000000003,273.50679999999994,265.64137,279.97756999999996);
				context.bezierCurveTo(263.21128,284.94451999999995,262.99769,286.21504999999996,263.64589,291.84819999999996);
				context.bezierCurveTo(265.39685000000003,307.06499999999994,264.64547,310.09781999999996,257.87161000000003,315.15523999999994);
				context.bezierCurveTo(254.81776000000002,317.43526999999995,246.76347000000004,318.2981699999999,242.80929000000003,316.76894999999996);
				context.lineTo(242.80929000000003,316.76894999999996);
				context.closePath();
				context.fillStyle = changeOpacity(strokecolor, 0.1); // strokecolor must be rgba
				context.fill();
				context.stroke();
				context.restore();
				context.restore();
				context.restore();
		    }
		};
		
		function drawRoundRect(x, y, width, height, strokecolor) {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
		    var radius = 10;
		    context.beginPath();
		    context.moveTo(x + radius, y);
		    context.lineTo(x + width - radius, y);
		    context.quadraticCurveTo(x + width, y, x + width, y + radius);
		    context.lineTo(x + width, y + height - radius);
		    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		    context.lineTo(x + radius, y + height);
		    context.quadraticCurveTo(x, y + height, x, y + height - radius);
		    context.lineTo(x, y + radius);
		    context.quadraticCurveTo(x, y, x + radius, y);
		    context.closePath();
		    context.lineWidth = 3;
		    context.strokeStyle = strokecolor;
		    if(getOpacity(strokecolor) >= 0.6) {  // strokecolor must be rgba
			    context.fillStyle = changeOpacity(strokecolor, 0.1); // strokecolor must be rgba
				context.fill();
		    }
		    context.stroke();
		};
		
		function drawAxis(context, startx, starty, endx, endy) {
			context.beginPath();
			context.moveTo(startx, starty);
			context.lineTo(endx, endy);
			context.closePath();
			context.stroke();
		}
		
		function drawRectangle(context, x, y, w, h, fillcolor, strokecolor) {			
			context.beginPath();
			context.rect(x, y, w, h);
			context.closePath();
			context.save();
			context.lineWidth = 0.75;
			context.shadowColor = "rgba(0,0,0, 0.4)";
		    context.shadowBlur = 7;
		    context.shadowOffsetX = 2;
		    context.shadowOffsetY = -2;
			context.strokeStyle = strokecolor;
			context.stroke();
			context.fillStyle = fillcolor;
			context.fill();
		    context.restore();
		}
		
		function changeOpacity(rgba, opacity) {
			var	colorStr = rgba.slice(rgba.indexOf('(') + 1, rgba.indexOf(')'));
			var	colorArr = colorStr.split(',');
			return "rgba("+colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + "," + opacity + ")";
		}
		
		function getOpacity(rgba) {
			var	colorStr = rgba.slice(rgba.indexOf('(') + 1, rgba.indexOf(')'));
			var	colorArr = colorStr.split(',');
			return colorArr[3];
		}
		
		function clearCanvas() {
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, canvas.width, canvas.height);
		}

		function placeStat(vennSize) {
			var axiscolor = "rgba(0,0,0, 0.7)";
			var canvas = $("#canvasEllipse")[0]; 
			var context = canvas.getContext("2d");
			
			/* 
			 * Bar chart
			*/
			var	h = 120,
				xmargin = 70,
				ymargin = 415,
				xspacer = 20,
				barwidth = (370-(vennSize*xspacer))/vennSize,
				ytext = 265;
			
			// Data
			var	data = sizeOfClass(),
				dataplot = new Array();
			var max = 0;
			for (var i=0; i<vennSize; i++) {
				max = Math.max(max, data[i]);
			}
			for (var i=0; i<vennSize; i++) {
				dataplot.push(data[i]/max * (h-50));
			}
		
			// Draw the bar chart
			context.fillStyle = "#000";
			context.font = 'italic 10pt Arial';
			context.textAlign = 'center';
		    context.fillText('Size of each lists', 250, ymargin+27);
		    context.font = 'normal 8pt Arial';
		    context.textAlign = 'right';
		    context.fillText(0, 45, ymargin + h + 2);
		    context.fillText(max/2, 45, ymargin + ((h+55)/2));
		    context.fillText(max, 45, ymargin + 54);
		    context.textAlign = 'left';
			for (var i=0; i<vennSize; i++) {
				drawRectangle(context,
							  xmargin + i*barwidth + i*xspacer,
							  ymargin + h-dataplot[i],
							  barwidth,
							  dataplot[i],
							  changeOpacity(opts.colors[i], 0.5),
							  opts.colors[i]);
				if(h-dataplot[i]+15 <= h-10) {
					context.textAlign = 'right';
					context.fillStyle = 'white';
					context.fillText(data[i], barwidth + 65 + i*barwidth + i*xspacer, ymargin + h-dataplot[i]+15);
				}
				else {
					context.fillText(data[i], barwidth + 65 + i*barwidth + i*xspacer, ymargin + h-dataplot[i]-10);
				}
				if(i%2 && vennSize>2) {	ytext = ymargin + h + 25; }
				else { ytext = ymargin + h + 15; }
				context.fillStyle = "#000";
				context.textAlign = 'center';
				context.fillText($("#label"+(i+1)).html(), (xmargin + i*barwidth + i*xspacer) + barwidth/2, ytext, 200);
				context.strokeStyle = axiscolor;
				context.lineWidth = 0.4;
				drawAxis(context, (xmargin + i*barwidth + i*xspacer) + barwidth/2, ymargin + h, (xmargin + i*barwidth + i*xspacer) + barwidth/2, ymargin + h+5);
			}
			
			// Draw the x and y axes
			context.lineWidth = 1;
			context.strokeStyle = axiscolor;
			drawAxis(context, 50, ymargin + h, 50, ymargin + 35); 
			drawAxis(context, 50, ymargin + h, 450, ymargin + h);
			context.lineWidth = 0.4;
			drawAxis(context, 47, ymargin + (h+48)/2, 53, ymargin + (h+48)/2);
			drawAxis(context, 47, ymargin + 50, 53, ymargin + 50);
			drawTriangle(50, ymargin+25,  46,ymargin+35,   54,ymargin+35, axiscolor);
			drawTriangle(460,ymargin+h, 450,ymargin+h-4, 450,ymargin+h+4, axiscolor);
			
			/* 
			 * Stacked bar chart
			*/
			// Data
			var	data2 = countByNbClass(),
				data2plot = new Array();
			xspacer = 2,
			xmargin = 60;
			ymargin += h + 50;
			var	maxwidth = 390 + xspacer,
				sum = 0;
			for (var i=0; i<vennSize; i++) {
				sum += data2[i];
			}
			for (var i=0; i<vennSize; i++) {
				data2plot.push(data2[i]/sum * maxwidth);
			}

			// Draw the bar chart
			context.font = 'italic 10pt Arial';
			context.textAlign = 'center';
		    context.fillText('Number of elements: specific (1) or shared by 2, 3, ... lists', 250, ymargin);
		    context.font = 'normal 8pt Arial';
			var	xprev = 0,
				ylegend = 0;
			
			for (var i=vennSize-1; i>=0; i--) {
				if(data2plot[i] == 0) { continue };
			    drawRectangle(context,
							  xmargin + xprev,
							  ymargin + 15,
							  data2plot[i] - xspacer,
							  20,
							  changeOpacity("rgb(156,106,156)", (1/(i+1.5))),
							  "rgba(0,0,0,0.5)");
				context.textAlign = 'center';
				context.fillStyle = 'white';
				if((data2plot[i] - xspacer) < 25) {
					context.fillStyle = '#000';
					context.fillText(i+1, (data2plot[i] - xspacer)/2  + xmargin + xprev, ymargin + 57 + ylegend);
					context.textAlign = 'left';
					context.fillText("(" + data2[i] + ")", (data2plot[i] - xspacer)/2  + xmargin + xprev + 6, ymargin + 57 + ylegend);
					if(ylegend != 48) { ylegend += 12; }
					else { ylegend = 0; }
				}
				else {
					if(ylegend >= 24) { ylegend = 0; }
					context.fillText(data2[i], (data2plot[i] - xspacer)/2  + xmargin + xprev, ymargin + 29);
					context.fillStyle = '#000';
					context.fillText(i+1, (data2plot[i] - xspacer)/2  + xmargin + xprev, ymargin + 57 + ylegend);
					ylegend = 0;
				}
				context.strokeStyle = axiscolor;
				context.lineWidth = 0.4;
				drawAxis(context, (data2plot[i] - xspacer)/2  + xmargin + xprev, ymargin+40, (data2plot[i] - xspacer)/2  + xmargin + xprev, ymargin+45);
				xprev += data2plot[i];
			}

		    // Draw the x axis
		    context.lineWidth = 1;
			context.strokeStyle = axiscolor;
			drawAxis(context, 50, ymargin+40, 460, ymargin+40);
		}
		
		function placeNumber(div, left, top, space) {
			// if shortNumber option && lenght>space
            console.log(div.text());
            if(opts.shortNumber  &&  div.text().length > space) {
				div.html("<span title=" + div.text() + ">?</span>");
			}
            var l = left - ((div.text().length-1)/2 * 8);
			div.css("left", l).css("top", top);
		}
		
		function transpose (a) {
			// Calculate the width and height of the Array
			var	w = a.length ? a.length : 0,
				h = a[0] instanceof Array ? a[0].length : 0;
			// In case it is a zero matrix, no transpose routine needed.
			if(h === 0 || w === 0) { return []; }
			var i, j, t = [];
			// Loop through every item in the outer array (height)
			for(i=0; i<h; i++) {
				// Insert a new row (array)
				t[i] = [];
				// Loop through every item per item in outer array (width)
				for(j=0; j<w; j++) {
					// Save transposed data.
					t[i][j] = a[j][i];
				}
			}
			return t;
		}
		
		function placeClassicVenn(vennSize) {
			var	grey = "rgba(0,0,0,0.1)";
						
			if (vennSize == 6) {
				drawTriangle(0,11,    254,160, 174,235, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawTriangle(188,0,   134,242, 236,202, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawTriangle(338,52,  135,123, 191,242, changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawTriangle(500,260, 163,117, 134,219, changeOpacity(opts.colors[3], $("#label4").css('opacity')));
				drawTriangle(250,415, 133,150, 203,67,  changeOpacity(opts.colors[4], $("#label5").css('opacity')));
				drawTriangle(11,307,  263,81,  214,220, changeOpacity(opts.colors[5], $("#label6").css('opacity')));
				
				$("#label1").css("left",  35).css("top",  10).css("color", opts.colors[0]);
				$("#label2").css("left", 200).css("top",   5).css("color", opts.colors[1]);
				$("#label3").css("left", 335).css("top",  60).css("color", opts.colors[2]);
				$("#label4").css("left", 410).css("top", 200).css("color", opts.colors[3]);
				$("#label5").css("left", 255).css("top", 385).css("color", opts.colors[4]);
				$("#label6").css("left",  30).css("top", 300).css("color", opts.colors[5]);
				placeNumber($("#resultC100000"),  98,  90, 6);
				placeNumber($("#resultC010000"), 187,  50, 4);
				placeNumber($("#resultC001000"), 280,  80, 6);
				placeNumber($("#resultC000100"), 320, 205, 6);
				placeNumber($("#resultC000010"), 212, 272, 5);
				placeNumber($("#resultC000001"), 100, 240, 6);
				placeNumber($("#resultC111111"), 185, 170, 6);
				drawLine(140, 80, 166,110, grey);
				placeNumber($("#resultC110000"), 132,  60, 6);
				placeNumber($("#resultC101000"), 142, 116, 2);
				drawLine( 75,180, 145,185, grey);
				drawLine( 75,180,  65,175, grey);
				placeNumber($("#resultC100100"),  55, 157, 6);
				placeNumber($("#resultC100010"), 140, 145, 2);
				drawLine( 75,200, 142,190, grey);
				drawLine( 75,200,  65,195, grey);
				placeNumber($("#resultC100001"),  55, 177, 6);
				drawLine(230, 80, 212,115, grey);
				placeNumber($("#resultC011000"), 230,  60, 6);
				placeNumber($("#resultC010100"), 225, 190, 1);
				placeNumber($("#resultC010010"), 193,  82, 3);
				placeNumber($("#resultC010001"), 145, 218, 2);
				drawLine(295,145, 235,180, grey);
				placeNumber($("#resultC001100"), 302, 132, 6);
				drawLine(275,270, 193,233, grey);
				placeNumber($("#resultC001010"), 275, 268, 6);
				placeNumber($("#resultC001001"), 232, 113, 4);
				placeNumber($("#resultC000110"), 216, 211, 1);
				drawLine( 75,220, 140,205, grey);
				drawLine( 75,220,  65,215, grey);
				placeNumber($("#resultC000101"),  55, 197, 6);
				drawLine(150,270, 183,230, grey);
				placeNumber($("#resultC000011"), 145, 268, 6);
				
				placeNumber($("#resultC111110"), 170, 130, 6);
				$("#resultC111110").hide();
				placeNumber($("#resultC111101"), 218, 155, 6);
				$("#resultC111101").hide();
				placeNumber($("#resultC111011"), 205, 125, 6);
				$("#resultC111011").hide();
				placeNumber($("#resultC110111"), 160, 190, 6);
				$("#resultC110111").hide();
				placeNumber($("#resultC101111"), 180, 212, 6);
				$("#resultC101111").hide();
				placeNumber($("#resultC011111"), 208, 197, 6);
				$("#resultC011111").hide();
				
				placeNumber($("#resultC111100"), 225, 170, 6);
				$("#resultC111100").hide();
				placeNumber($("#resultC111010"), 182, 113, 6);
				$("#resultC111010").hide();
				placeNumber($("#resultC110110"), 149, 163, 6);
				$("#resultC110110").hide();
				placeNumber($("#resultC101110"), 152, 140, 6);
				$("#resultC101110").hide();
				placeNumber($("#resultC011110"), 215, 195, 6);
				$("#resultC011110").hide();
				placeNumber($("#resultC111001"), 212, 128, 6);
				$("#resultC111001").hide();
				placeNumber($("#resultC110101"), 150, 194, 6);
				$("#resultC110101").hide();
				placeNumber($("#resultC110011"), 168, 216, 6);
				$("#resultC110011").hide();
				placeNumber($("#resultC101101"), 226, 145, 6);
				$("#resultC101101").hide();
				placeNumber($("#resultC101011"), 178, 216, 6);
				$("#resultC101011").hide();
				placeNumber($("#resultC100111"), 178, 214, 6);
				$("#resultC100111").hide();
				placeNumber($("#resultC011101"), 218, 180, 6);
				$("#resultC011101").hide();
				placeNumber($("#resultC011011"), 206, 122, 6);
				$("#resultC011011").hide();
				placeNumber($("#resultC010111"), 215, 198, 6);
				$("#resultC010111").hide();
				placeNumber($("#resultC001111"), 200, 208, 6);
				$("#resultC001111").hide();
				
				placeNumber($("#resultC111000"), 156, 105, 6);
				$("#resultC111000").hide();
				placeNumber($("#resultC110100"), 145, 174, 6);
				$("#resultC110100").hide();
				placeNumber($("#resultC110010"), 163, 100, 6);
				$("#resultC110010").hide();
				placeNumber($("#resultC101100"), 238, 152, 6);
				$("#resultC101100").hide();
				placeNumber($("#resultC101010"), 148, 128, 6);
				$("#resultC101010").hide();
				placeNumber($("#resultC100110"), 145, 158, 6);
				$("#resultC100110").hide();
				placeNumber($("#resultC011100"), 226, 178, 6);
				$("#resultC011100").hide();
				placeNumber($("#resultC011010"), 195, 105, 6);
				$("#resultC011010").hide();
				placeNumber($("#resultC010110"), 218, 198, 6);
				$("#resultC010110").hide();
				placeNumber($("#resultC001110"), 202, 216, 6);
				$("#resultC001110").hide();
				placeNumber($("#resultC110001"), 160, 213, 6);
				$("#resultC110001").hide();
				placeNumber($("#resultC101001"), 220, 132, 6);
				$("#resultC101001").hide();
				placeNumber($("#resultC100101"), 139, 182, 6);
				$("#resultC100101").hide();
				placeNumber($("#resultC100011"), 170, 220, 6);
				$("#resultC100011").hide();
				placeNumber($("#resultC011001"), 212, 122, 6);
				$("#resultC011001").hide();
				placeNumber($("#resultC010101"), 146, 203, 6);
				$("#resultC010101").hide();
				placeNumber($("#resultC010011"), 164, 220, 6);
				$("#resultC010011").hide();
				placeNumber($("#resultC001101"), 233, 138, 6);
				$("#resultC001101").hide();
				placeNumber($("#resultC001011"), 185, 218, 6);
				$("#resultC001011").hide();
				placeNumber($("#resultC000111"), 209, 207, 6);
				$("#resultC000111").hide();
				
			} else if (vennSize == 5) {
				drawEllipse(214,230,10,18.6,9.5,25,  changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawEllipse(232,187,10,18.6,9.5,98,  changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawEllipse(273,196,10,18.6,9.5,170, changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawEllipse(282,238,10,18.6,9.5,62,  changeOpacity(opts.colors[3], $("#label4").css('opacity')));
				drawEllipse(242,260,10,18.6,9.5,134, changeOpacity(opts.colors[4], $("#label5").css('opacity')));
				
				$("#label1").css("left",   0).css("top", 100).css("color",   opts.colors[0]);
				$("#label2").css("left", 310).css("top",  15).css("color",  opts.colors[1]);
				$("#label3").css("left", 450).css("top", 120).css("color", opts.colors[2]);
				$("#label4").css("left", 387).css("top", 400).css("color", opts.colors[3]);
				$("#label5").css("left",  40).css("top", 400).css("color",  opts.colors[4]);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"),  75, 150, 6);
				placeNumber($("#resultC010000"), 245,  30, 6);
				placeNumber($("#resultC001000"), 415, 162, 6);
				placeNumber($("#resultC000100"), 350, 370, 6);
				placeNumber($("#resultC000010"), 132, 370, 6);
				placeNumber($("#resultC110000"), 152, 118, 2);
				placeNumber($("#resultC101000"), 110, 200, 6);
				placeNumber($("#resultC100100"), 350, 295, 6);
				placeNumber($("#resultC100010"), 125, 273, 2);
				placeNumber($("#resultC011000"), 309,  94, 3);
				placeNumber($("#resultC010100"), 215,  82, 6);
				placeNumber($("#resultC010010"), 195, 340, 6);
				placeNumber($("#resultC001100"), 378, 232, 2);
				placeNumber($("#resultC001010"), 360, 140, 5);
				placeNumber($("#resultC000110"), 261, 347, 2);
				placeNumber($("#resultC111000"), 148, 180, 4);
				placeNumber($("#resultC110100"), 168, 113, 2);
				placeNumber($("#resultC110010"), 176, 295, 6);
				placeNumber($("#resultC101100"), 367, 248, 2);
				placeNumber($("#resultC101010"), 127, 256, 2);
				placeNumber($("#resultC100110"), 305, 300, 4);
				placeNumber($("#resultC011100"), 240, 110, 6);
				placeNumber($("#resultC011010"), 317, 108, 2);
				placeNumber($("#resultC010110"), 248, 338, 2);
				placeNumber($("#resultC001110"), 345, 180, 4);
				placeNumber($("#resultC111100"), 185, 140, 6);
				placeNumber($("#resultC111010"), 158, 245, 6);
				placeNumber($("#resultC110110"), 250, 310, 6);
				placeNumber($("#resultC101110"), 330, 240, 6);
				placeNumber($("#resultC011110"), 290, 133, 6);
				placeNumber($("#resultC111110"), 245, 210, 6);				
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);

			} else if (vennSize == 4) {	
				drawEllipse(181,238,10,18.5,11.5,40,  changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawEllipse(242,177,10,18.5,11.5,40,  changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawEllipse(259,177,10,18.5,11.5,140, changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawEllipse(320,238,10,18.5,11.5,140, changeOpacity(opts.colors[3], $("#label4").css('opacity')));
				
				$("#label1").css("left", 5).css("top", 70).css("color",   opts.colors[0]);
				$("#label2").css("left", 85).css("top", 5).css("color",   opts.colors[1]);
				$("#label3").css("left", 350).css("top", 5).css("color",  opts.colors[2]);
				$("#label4").css("left", 428).css("top", 70).css("color", opts.colors[3]);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"),  55, 190, 6);
				placeNumber($("#resultC010000"), 140,  60, 6);
				placeNumber($("#resultC001000"), 335,  60, 6);
				placeNumber($("#resultC000100"), 430, 190, 6);
				placeNumber($("#resultC110000"), 105, 120, 6);
				placeNumber($("#resultC101000"), 130, 260, 6);
				placeNumber($("#resultC100100"), 245, 340, 6);
				placeNumber($("#resultC011000"), 245,  90, 6);
				placeNumber($("#resultC010100"), 365, 260, 6);
				placeNumber($("#resultC001100"), 385, 120, 6);
				placeNumber($("#resultC111000"), 160, 170, 6);
				placeNumber($("#resultC110100"), 310, 290, 6);
				placeNumber($("#resultC101100"), 180, 290, 6);
				placeNumber($("#resultC011100"), 330, 170, 6);
				placeNumber($("#resultC111100"), 245, 220, 6);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else if (vennSize == 3) {
				drawEllipse(171,142,120,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawEllipse(327,142,120,1,1,0, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawEllipse(249,271,120,1,1,0, changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				
				$("#label1").css("left", 55).css("top", 5).css("color",    opts.colors[0]);
				$("#label2").css("left", 380).css("top", 5).css("color",   opts.colors[1]);
				$("#label3").css("left", 220).css("top", 400).css("color", opts.colors[2]);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 120, 100, 8);
				placeNumber($("#resultC010000"), 360, 100, 8);
				placeNumber($("#resultC001000"), 245, 330, 8);
				placeNumber($("#resultC110000"), 245, 100, 8);
				placeNumber($("#resultC101000"), 170, 220, 8);
				placeNumber($("#resultC011000"), 320, 220, 8);
				placeNumber($("#resultC111000"), 245, 175, 8);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else if (vennSize == 2) {	
				drawEllipse(171,206,140,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawEllipse(327,206,140,1,1,0, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				
				$("#label1").css("left", 95).css("top", 40).css("color",  opts.colors[0]);
				$("#label2").css("left", 360).css("top", 40).css("color", opts.colors[1]);
				$("#label3").css("left", -1000).css("top", -2200);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 120, 195, 10);
				placeNumber($("#resultC010000"), 360, 195, 10);
				placeNumber($("#resultC110000"), 250, 195, 10);
				$("#resultC001000").css("left", -1000).css("top", -2200);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC101000").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC011000").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC111000").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else {
				drawEllipse(246,210,140,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				
				$("#label1").css("left", 225).css("top", 30).css("color", opts.colors[0]);
				$("#label2").css("left", -1000).css("top", -2200);
				$("#label3").css("left", -1000).css("top", -2200);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 245, 200, 10);
				$("#resultC010000").css("left", -1000).css("top", -2200);
				$("#resultC001000").css("left", -1000).css("top", -2200);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC110000").css("left", -1000).css("top", -2200);
				$("#resultC101000").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC011000").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC111000").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			}
		}
		
		function placeEdwardsVenn(vennSize) {
			if (vennSize == 6) {
				drawCircle(246,206,90,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawRoundRect(245,25,250,365,changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawRoundRect(5,205,490,185,changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawDoubleCircle(changeOpacity(opts.colors[3], $("#label4").css('opacity')));
				drawCross(changeOpacity(opts.colors[4], $("#label5").css('opacity')));
				drawCross2(changeOpacity(opts.colors[5], $("#label6").css('opacity')));
				
				$("#label1").css("left", 297).css("top", 90).css("color", opts.colors[0]);
				$("#label2").css("left", 267).css("top",  0).css("color", opts.colors[1]);
				$("#label3").css("left",  27).css("top",400).css("color", opts.colors[2]);
				$("#label4").css("left",  55).css("top", 90).css("color", opts.colors[3]);
				$("#label5").css("left", 282).css("top", 45).css("color", opts.colors[4]);
				$("#label6").css("left", 297).css("top",302).css("color", opts.colors[5]);
				placeNumber($("#resultC100000"), 204, 122, 1);
				placeNumber($("#resultC010000"), 390,  70, 6);
				placeNumber($("#resultC001000"),  85, 330, 6);
				placeNumber($("#resultC000100"),  85, 150, 6);
				placeNumber($("#resultC000010"), 225,  70, 3);
				placeNumber($("#resultC110000"), 280, 122, 1);
				placeNumber($("#resultC101000"), 204, 269, 1);
				placeNumber($("#resultC100100"), 172, 155, 1);
				placeNumber($("#resultC100010"), 218, 118, 1);
				placeNumber($("#resultC011000"), 390, 330, 6);
				placeNumber($("#resultC010100"), 390, 150, 6);
				placeNumber($("#resultC010010"), 258,  70, 3);
				placeNumber($("#resultC001100"),  85, 240, 6);
				placeNumber($("#resultC001010"), 225, 320, 3);
				placeNumber($("#resultC000110"), 120, 178, 2);
				placeNumber($("#resultC111000"), 280, 269, 1);
				placeNumber($("#resultC110100"), 314, 155, 1);
				placeNumber($("#resultC110010"), 266, 118, 1);
				placeNumber($("#resultC101100"), 172, 235, 1);
				placeNumber($("#resultC101010"), 219, 274, 1);
				placeNumber($("#resultC100110"), 167, 171, 1);
				placeNumber($("#resultC011100"), 390, 240, 6);
				placeNumber($("#resultC011010"), 258, 320, 3);
				placeNumber($("#resultC010110"), 365, 178, 2);
				placeNumber($("#resultC001110"), 120, 212, 2);
				placeNumber($("#resultC111100"), 315, 235, 1);
				placeNumber($("#resultC111010"), 266, 274, 1);
				placeNumber($("#resultC110110"), 320, 171, 1);
				placeNumber($("#resultC101110"), 166, 218, 1);
				placeNumber($("#resultC011110"), 365, 212, 2);
				placeNumber($("#resultC111110"), 320, 218, 1);
				placeNumber($("#resultC000001"), 180, 120, 1);
				placeNumber($("#resultC100001"), 199, 134, 1);
				placeNumber($("#resultC010001"), 304, 120, 1);
				placeNumber($("#resultC001001"), 179, 271, 1);
				placeNumber($("#resultC000101"), 169, 132, 1);
				placeNumber($("#resultC000011"), 234,  95, 1);
				placeNumber($("#resultC110001"), 286, 134, 1);
				placeNumber($("#resultC101001"), 199, 256, 1);
				placeNumber($("#resultC100101"), 190, 149, 1);
				placeNumber($("#resultC100011"), 228, 135, 3);
				placeNumber($("#resultC011001"), 306, 272, 1);
				placeNumber($("#resultC010101"), 317, 132, 1);
				placeNumber($("#resultC010011"), 250,  95, 1);
				placeNumber($("#resultC001101"), 167, 260, 1);
				placeNumber($("#resultC001011"), 233, 296, 1);
				placeNumber($("#resultC000111"), 143, 187, 1);
				placeNumber($("#resultC111001"), 285, 256, 1);
				placeNumber($("#resultC110101"), 295, 149, 1);
				placeNumber($("#resultC110011"), 255, 135, 3);
				placeNumber($("#resultC101101"), 190, 242, 1);
				placeNumber($("#resultC101011"), 227, 255, 3);
				placeNumber($("#resultC100111"), 213, 178, 6);
				placeNumber($("#resultC011101"), 318, 259, 1);
				placeNumber($("#resultC011011"), 250, 296, 1);
				placeNumber($("#resultC010111"), 342, 187, 1);
				placeNumber($("#resultC001111"), 143, 203, 1);
				placeNumber($("#resultC111101"), 295, 240, 1);
				placeNumber($("#resultC111011"), 256, 255, 3);
				placeNumber($("#resultC110111"), 270, 178, 6);
				placeNumber($("#resultC101111"), 213, 212, 6);
				placeNumber($("#resultC011111"), 342, 203, 1);
				placeNumber($("#resultC111111"), 270, 212, 6);
				
			} else if (vennSize == 5) {
				drawCircle(246,206,90,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawRoundRect(245,25,250,365,changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawRoundRect(5,205,490,185, changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawDoubleCircle(changeOpacity(opts.colors[3], $("#label4").css('opacity')));
				drawCross(changeOpacity(opts.colors[4], $("#label5").css('opacity')));
			
				$("#label1").css("left", 297).css("top", 90).css("color", opts.colors[0]);
				$("#label2").css("left", 267).css("top",  0).css("color", opts.colors[1]);
				$("#label3").css("left",  27).css("top",400).css("color", opts.colors[2]);
				$("#label4").css("left",  55).css("top", 90).css("color", opts.colors[3]);
				$("#label5").css("left", 282).css("top", 45).css("color", opts.colors[4]);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 200, 130, 3);
				placeNumber($("#resultC010000"), 390,  70, 6);
				placeNumber($("#resultC001000"),  85, 330, 6);
				placeNumber($("#resultC000100"),  85, 150, 6);
				placeNumber($("#resultC000010"), 225,  80, 4);
				placeNumber($("#resultC110000"), 284, 130, 3);
				placeNumber($("#resultC101000"), 200, 260, 3);
				placeNumber($("#resultC100100"), 185, 150, 4);
				placeNumber($("#resultC100010"), 228, 130, 3);
				placeNumber($("#resultC011000"), 390, 330, 6);
				placeNumber($("#resultC010100"), 390, 150, 6);
				placeNumber($("#resultC010010"), 258,  80, 4);
				placeNumber($("#resultC001100"),  85, 240, 6);
				placeNumber($("#resultC001010"), 225, 310, 4);
				placeNumber($("#resultC000110"), 133, 178, 6);
				placeNumber($("#resultC111000"), 284, 260, 3);
				placeNumber($("#resultC110100"), 300, 150, 4);
				placeNumber($("#resultC110010"), 255, 130, 3);
				placeNumber($("#resultC101100"), 185, 240, 4);
				placeNumber($("#resultC101010"), 228, 260, 3);
				placeNumber($("#resultC100110"), 213, 178, 6);
				placeNumber($("#resultC011100"), 390, 240, 6);
				placeNumber($("#resultC011010"), 258, 310, 4);
				placeNumber($("#resultC010110"), 355, 178, 6);
				placeNumber($("#resultC001110"), 133, 212, 6);
				placeNumber($("#resultC111100"), 300, 240, 4);
				placeNumber($("#resultC111010"), 256, 260, 3);
				placeNumber($("#resultC110110"), 270, 178, 6);
				placeNumber($("#resultC101110"), 213, 212, 6);
				placeNumber($("#resultC011110"), 355, 212, 6);
				placeNumber($("#resultC111110"), 270, 212, 6);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
				
			} else if (vennSize == 4) {
				drawCircle(246,206,90,1,1,0,  changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawRoundRect(245,25,250,365, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawRoundRect(5,205,490,185,  changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				drawDoubleCircle(changeOpacity(opts.colors[3], $("#label4").css('opacity')));

				$("#label1").css("left", 267).css("top", 90).css("color", opts.colors[0]);
				$("#label2").css("left", 267).css("top",  0).css("color", opts.colors[1]);
				$("#label3").css("left",  27).css("top",400).css("color", opts.colors[2]);
				$("#label4").css("left",  27).css("top", 90).css("color", opts.colors[3]);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 215, 130, 6);
				placeNumber($("#resultC010000"), 390,  70, 6);
				placeNumber($("#resultC001000"),  85, 330, 6);
				placeNumber($("#resultC000100"),  85, 150, 6);
				placeNumber($("#resultC110000"), 265, 130, 6);
				placeNumber($("#resultC101000"), 215, 260, 6);
				placeNumber($("#resultC100100"), 200, 170, 6);
				placeNumber($("#resultC011000"), 390, 330, 6);
				placeNumber($("#resultC010100"), 390, 150, 6);
				placeNumber($("#resultC001100"),  85, 240, 6);
				placeNumber($("#resultC111000"), 265, 260, 6);
				placeNumber($("#resultC110100"), 280, 170, 6);
				placeNumber($("#resultC101100"), 200, 220, 6);
				placeNumber($("#resultC011100"), 390, 240, 6);
				placeNumber($("#resultC111100"), 280, 220, 6);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);			
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else if (vennSize == 3) {
				drawCircle(246,206,110,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawRoundRect(245,25,250,365, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				drawRoundRect(5,205,490,185,  changeOpacity(opts.colors[2], $("#label3").css('opacity')));
				
				$("#label1").css("left", 95).css("top", 75).css("color",  opts.colors[0]);
				$("#label2").css("left", 267).css("top",  0).css("color", opts.colors[1]);
				$("#label3").css("left",  27).css("top",400).css("color", opts.colors[2]);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 190, 150, 8);
				placeNumber($("#resultC010000"), 390,  70, 8);
				placeNumber($("#resultC001000"),  85, 330, 8);
				placeNumber($("#resultC110000"), 290, 150, 8);
				placeNumber($("#resultC101000"), 190, 240, 8);
				placeNumber($("#resultC011000"), 390, 330, 8);
				placeNumber($("#resultC111000"), 290, 240, 8);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else if (vennSize == 2) {
				drawCircle(246,206,110,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				drawRoundRect(245,25,250,365, changeOpacity(opts.colors[1], $("#label2").css('opacity')));
				
				$("#label1").css("left", 95).css("top", 75).css("color",  opts.colors[0]);
				$("#label2").css("left", 267).css("top",  0).css("color", opts.colors[1]);
				$("#label3").css("left", -1000).css("top", -2200);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 180, 195, 10);
				placeNumber($("#resultC010000"), 420, 195, 10);
				placeNumber($("#resultC110000"), 290, 195, 10);
				$("#resultC001000").css("left", -1000).css("top", -2200);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC101000").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC011000").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC111000").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			
			} else {
				drawCircle(246,210,140,1,1,0, changeOpacity(opts.colors[0], $("#label1").css('opacity')));
				
				$("#label1").css("left", 225).css("top", 30).css("color", opts.colors[0]);
				$("#label2").css("left", -1000).css("top", -2200);
				$("#label3").css("left", -1000).css("top", -2200);
				$("#label4").css("left", -1000).css("top", -2200);
				$("#label5").css("left", -1000).css("top", -2200);
				$("#label6").css("left", -1000).css("top", -2200);
				placeNumber($("#resultC100000"), 245, 200, 10);
				$("#resultC010000").css("left", -1000).css("top", -2200);
				$("#resultC001000").css("left", -1000).css("top", -2200);
				$("#resultC000100").css("left", -1000).css("top", -2200);
				$("#resultC000010").css("left", -1000).css("top", -2200);
				$("#resultC110000").css("left", -1000).css("top", -2200);
				$("#resultC101000").css("left", -1000).css("top", -2200);
				$("#resultC100100").css("left", -1000).css("top", -2200);
				$("#resultC100010").css("left", -1000).css("top", -2200);
				$("#resultC011000").css("left", -1000).css("top", -2200);
				$("#resultC010100").css("left", -1000).css("top", -2200);
				$("#resultC010010").css("left", -1000).css("top", -2200);
				$("#resultC001100").css("left", -1000).css("top", -2200);
				$("#resultC001010").css("left", -1000).css("top", -2200);
				$("#resultC000110").css("left", -1000).css("top", -2200);
				$("#resultC111000").css("left", -1000).css("top", -2200);
				$("#resultC110100").css("left", -1000).css("top", -2200);
				$("#resultC110010").css("left", -1000).css("top", -2200);
				$("#resultC101100").css("left", -1000).css("top", -2200);
				$("#resultC101010").css("left", -1000).css("top", -2200);
				$("#resultC100110").css("left", -1000).css("top", -2200);
				$("#resultC011100").css("left", -1000).css("top", -2200);
				$("#resultC011010").css("left", -1000).css("top", -2200);
				$("#resultC010110").css("left", -1000).css("top", -2200);
				$("#resultC001110").css("left", -1000).css("top", -2200);
				$("#resultC111100").css("left", -1000).css("top", -2200);
				$("#resultC111010").css("left", -1000).css("top", -2200);
				$("#resultC110110").css("left", -1000).css("top", -2200);
				$("#resultC101110").css("left", -1000).css("top", -2200);
				$("#resultC011110").css("left", -1000).css("top", -2200);
				$("#resultC111110").css("left", -1000).css("top", -2200);
				$("#resultC000001").css("left", -1000).css("top", -2200);
				$("#resultC100001").css("left", -1000).css("top", -2200);
				$("#resultC010001").css("left", -1000).css("top", -2200);
				$("#resultC001001").css("left", -1000).css("top", -2200);
				$("#resultC000101").css("left", -1000).css("top", -2200);
				$("#resultC000011").css("left", -1000).css("top", -2200);
				$("#resultC110001").css("left", -1000).css("top", -2200);
				$("#resultC101001").css("left", -1000).css("top", -2200);
				$("#resultC100101").css("left", -1000).css("top", -2200);
				$("#resultC100011").css("left", -1000).css("top", -2200);
				$("#resultC011001").css("left", -1000).css("top", -2200);
				$("#resultC010101").css("left", -1000).css("top", -2200);
				$("#resultC010011").css("left", -1000).css("top", -2200);
				$("#resultC001101").css("left", -1000).css("top", -2200);
				$("#resultC001011").css("left", -1000).css("top", -2200);
				$("#resultC000111").css("left", -1000).css("top", -2200);
				$("#resultC111001").css("left", -1000).css("top", -2200);
				$("#resultC110101").css("left", -1000).css("top", -2200);
				$("#resultC110011").css("left", -1000).css("top", -2200);
				$("#resultC101101").css("left", -1000).css("top", -2200);
				$("#resultC101011").css("left", -1000).css("top", -2200);
				$("#resultC100111").css("left", -1000).css("top", -2200);
				$("#resultC011101").css("left", -1000).css("top", -2200);
				$("#resultC011011").css("left", -1000).css("top", -2200);
				$("#resultC010111").css("left", -1000).css("top", -2200);
				$("#resultC001111").css("left", -1000).css("top", -2200);
				$("#resultC111101").css("left", -1000).css("top", -2200);
				$("#resultC111011").css("left", -1000).css("top", -2200);
				$("#resultC110111").css("left", -1000).css("top", -2200);
				$("#resultC101111").css("left", -1000).css("top", -2200);
				$("#resultC011111").css("left", -1000).css("top", -2200);
				$("#resultC111111").css("left", -1000).css("top", -2200);
			}
		}
		
		function addLegend(div, vennSize) {
			$t = div;
			var i=1;
			var hide = "";
			var div_legend = '<div class="module-legend">';
			$("*[id^=label]").each(function(){
				div_legend += '<div id="item-'+i+'" name="' + $(this).text() + '" class="leg-items" style="opacity:0.5; background-color:' + $(this).css("color") + hide + '">';
				div_legend += '<span style="background-color:white; margin-left:0px; padding:0px 2px 0px 2px; transition: margin-left .3s ease-in-out;">off</span></div>';
				i += 1;
				if(i>vennSize) {
					hide = ";display:none";
				}
			});
			div_legend += '</div>';
			$t.append(div_legend);
			
			$("*[id^=item]").hover(function(){
		        $(this).css('opacity', 0.75);
		        $(this).css('box-shadow',  '0px 0px 8px 1px lightgrey');
		    },function(){
		    	if($(this).children("span").text() === 'off') {
					$(this).css('opacity', 0.5);
		    	}
				$(this).css('box-shadow',  'none');
		    });
			$("*[id^=item]").click(function(){
				var visible_id = null ;
				if ($(this).children("span").text() === 'off') {
					visible_id = select( $(this).attr('name') );
				}
				else {
					visible_id = unselect( $(this).attr('name') );
				}
				// Clear search
				if (opts.searchInput != null) {
					opts.searchInput.val("");
					if (opts.searchStatus != null) {
						opts.searchStatus.text("");
					}
				}
				// Draw
				clearCanvas();
            	if (opts.displayMode == 'edwards') {
                   	placeEdwardsVenn(vennSize);
                } else {
                   	placeClassicVenn(vennSize);
                }
            	if (opts.displayStat) {
            		placeStat(vennSize);
                }
            	if (visible_id != "resultC000000") { 
            		$("#" + visible_id).show();
            	}
			});
		}
		
		function fillListVenn() {
			var classified=new Array();
			var actualList=new Array();
			actualList[0]=new Array();
			actualList[1]=new Array();
			actualList[2]=new Array();
			actualList[3]=new Array();
			actualList[4]=new Array();
			actualList[5]=new Array();
			
			for (m=0;m<opts.series.length;m++) {
				actualList[m]=new Array();
				var list = opts.series[m].data;
				for (t=0;t<list.length;t++) {
					if (list[t].length>0) {
						if (actualList[m][list[t]]) {
							actualList[m][list[t]]++;
						} else {
							actualList[m][list[t]]=1;
						}
						classified[list[t]]="C";
					}
				}
			}
			
			for (t=0;t<6;t++) {
				for (tt in actualList[t]) {
					if (classified[tt]) {
						classified[tt]=classified[tt]+"1";
					}
				}
				
				for (cl in classified) {
					if (classified[cl].length<t+2) {
						classified[cl]=classified[cl]+"0";
					}
				}
			}

			for (cl in classified) {
				var value = parseInt($("#result"+classified[cl]).html());
				
				if (opts.useValues) {
					for (var m=0;m<opts.series.length;m++) {
						// Is the value in the list
						var index_val = opts.series[m].data.indexOf(cl);
						if (index_val != -1) {
							value += parseInt(opts.series[m].values[index_val]);
						}
					}
				} else {
					value += 1;
				}
				$("#result"+classified[cl]).html(value);
				$("#result"+classified[cl]).removeClass("number-empty");
			}
			
			// Update the labels
			if (opts.series.length == 6) {
				$("#label1").html(opts.series[0].name);
				$("#label2").html(opts.series[1].name);
				$("#label3").html(opts.series[2].name);
				$("#label4").html(opts.series[3].name);
				$("#label5").html(opts.series[4].name);
				$("#label6").html(opts.series[5].name);
			} else if (opts.series.length == 5) {
				$("#label1").html(opts.series[0].name);
				$("#label2").html(opts.series[1].name);
				$("#label3").html(opts.series[2].name);
				$("#label4").html(opts.series[3].name);
				$("#label5").html(opts.series[4].name);
			} else if (opts.series.length == 4) {
				$("#label1").html(opts.series[0].name);
				$("#label2").html(opts.series[1].name);
				$("#label3").html(opts.series[2].name);
				$("#label4").html(opts.series[3].name);
			} else if (opts.series.length == 3) {
				$("#label1").html(opts.series[0].name);
				$("#label2").html(opts.series[1].name);
				$("#label3").html(opts.series[2].name);
			} else if (opts.series.length == 2) {
				$("#label1").html(opts.series[0].name);
				$("#label2").html(opts.series[1].name);
			} else if (opts.series.length == 1) {
				$("#label1").html(opts.series[0].name);
			}
			
			if (!opts.disableClick) {
				// Add some eventlistener
				$("*[id^=resultC]").mouseover(opts.fnClickCallback);
	            $("*[id^=resultC]").mouseout(function(){
	            	$(this).removeClass("number-over");
	            }); 
	            $("*[id^=resultC]").click(opts.fnClickCallback);
			}
            
            // Add info to the number
            $("*[id^=resultC]").each(function(){
            	this.listnames = new Array();
            	for (var i=6; i<$(this).attr("id").length; i++) {
            		if ($(this).attr("id").substring(i+1,i+2) == "1") {
            			try { this.listnames.push(opts.series[i-6].name); } catch(err) {}
            		}
            	}
            	this.empty = true;
				this.list = new Array();
				var cvalue = $(this).attr("id").substring(6,13);
				for (cl in classified) {
					if (classified[cl]==cvalue) {
						this.list.push(cl);
						this.empty = false;
					}
				}
            });
		}
		
		// Return an Array with number of common and specific element (x in 1 class, y in 2 class...) 
		function countByNbClass() {
			var data = new Array(0,0,0,0,0,0);
			$("*[id^=resultC]").each(function(){
				var n = 0;
				for (var i=6; i<$(this).attr("id").length; i++) {
					n += $(this).attr("id").substring(i+1,i+2) == "1";
				}
				var val = $(this).text();
				if(val == '?') {
					val = $(this).children("span").attr('title');
				}
				data[n-1] += parseInt(val);
			});
			return data;
		}
		
		// Return an Array with size of each class 
		function sizeOfClass() {
			var data = new Array(0,0,0,0,0,0);
			$("*[id^=resultC]").each(function(){
				for (var i=6; i<$(this).attr("id").length; i++) {
					if ($(this).attr("id").substring(i+1,i+2) == "1") {
						
						var val = $(this).text();
						if(val == '?') {
							val = $(this).children("span").attr('title');
						}
						data[i-6] += parseInt(val);
					}
				}
			});
			return data;
		}
		
		function setValuesforFillCountVenn (values) {
			if (values.A) { $("#resultC100000").html(values.A); }
			if (values.B) { $("#resultC010000").html(values.B); }
			if (values.C) { $("#resultC001000").html(values.C); }
			if (values.D) { $("#resultC000100").html(values.D); }
			if (values.E) { $("#resultC000010").html(values.E); }
			if (values.F) { $("#resultC000001").html(values.F); }
			if (values.AB) { $("#resultC110000").html(values.AB); }
			if (values.AC) { $("#resultC101000").html(values.AC); }
			if (values.AD) { $("#resultC100100").html(values.AD); }
			if (values.AE) { $("#resultC100010").html(values.AE); }
			if (values.AF) { $("#resultC100001").html(values.AF); }
			if (values.BC) { $("#resultC011000").html(values.BC); }
			if (values.BD) { $("#resultC010100").html(values.BD); }
			if (values.BE) { $("#resultC010010").html(values.BE); }
			if (values.BF) { $("#resultC010001").html(values.BF); }
			if (values.CD) { $("#resultC001100").html(values.CD); }
			if (values.CE) { $("#resultC001010").html(values.CE); }
			if (values.CF) { $("#resultC001001").html(values.CF); }
			if (values.DE) { $("#resultC000110").html(values.DE); }
			if (values.DF) { $("#resultC000101").html(values.DF); }
			if (values.EF) { $("#resultC000011").html(values.EF); }
			if (values.ABC) { $("#resultC111000").html(values.ABC); }
			if (values.ABD) { $("#resultC110100").html(values.ABD); }
			if (values.ABE) { $("#resultC110010").html(values.ABE); }
			if (values.ABF) { $("#resultC110001").html(values.ABF); }
			if (values.ACD) { $("#resultC101100").html(values.ACD); }
			if (values.ACE) { $("#resultC101010").html(values.ACE); }
			if (values.ACF) { $("#resultC101001").html(values.ACF); }
			if (values.ADE) { $("#resultC100110").html(values.ADE); }
			if (values.ADF) { $("#resultC100101").html(values.ADF); }
			if (values.AEF) { $("#resultC100011").html(values.AEF); }
			if (values.BCD) { $("#resultC011100").html(values.BCD); }
			if (values.BCE) { $("#resultC011010").html(values.BCE); }
			if (values.BCF) { $("#resultC011001").html(values.BCF); }
			if (values.BDE) { $("#resultC010110").html(values.BDE); }
			if (values.BDF) { $("#resultC010101").html(values.BDF); }
			if (values.BEF) { $("#resultC010011").html(values.BEF); }
			if (values.CDE) { $("#resultC001110").html(values.CDE); }
			if (values.CDF) { $("#resultC001101").html(values.CDF); }
			if (values.CEF) { $("#resultC001011").html(values.CEF); }
			if (values.DEF) { $("#resultC000111").html(values.DEF); }
			if (values.ABCD) { $("#resultC111100").html(values.ABCD); }
			if (values.ABCE) { $("#resultC111010").html(values.ABCE); }
			if (values.ABCF) { $("#resultC111001").html(values.ABCF); }
			if (values.ABDE) { $("#resultC110110").html(values.ABDE); }
			if (values.ABDF) { $("#resultC110101").html(values.ABDF); }
			if (values.ACDE) { $("#resultC101110").html(values.ACDE); }
			if (values.ACDF) { $("#resultC101101").html(values.ACDF); }
			if (values.BCDE) { $("#resultC011110").html(values.BCDE); }
			if (values.BCDF) { $("#resultC011101").html(values.BCDF); }
			if (values.CDEF) { $("#resultC001111").html(values.CDEF); }
			if (values.BDEF) { $("#resultC010111").html(values.BDEF); }
			if (values.BCEF) { $("#resultC011011").html(values.BCEF); }
			if (values.ADEF) { $("#resultC100111").html(values.ADEF); }
			if (values.ACEF) { $("#resultC101011").html(values.ACEF); }
			if (values.ABEF) { $("#resultC110011").html(values.ABEF); }
			if (values.ABCDE) { $("#resultC111110").html(values.ABCDE); }
			if (values.ABCDF) { $("#resultC111101").html(values.ABCDF); }
			if (values.ABCEF) { $("#resultC111011").html(values.ABCEF); }
			if (values.ABDEF) { $("#resultC110111").html(values.ABDEF); }
			if (values.ACDEF) { $("#resultC101111").html(values.ACDEF); }
			if (values.BCDEF) { $("#resultC011111").html(values.BCDEF); }
			if (values.ABCDEF) { $("#resultC111111").html(values.ABCDEF); }
		}

		function fillCountVenn() {
			// Update the labels
			if (opts.series[0].name.A) { $("#label1").html(opts.series[0].name.A); }
			if (opts.series[0].name.B) { $("#label2").html(opts.series[0].name.B); }
			if (opts.series[0].name.C) { $("#label3").html(opts.series[0].name.C); }
			if (opts.series[0].name.D) { $("#label4").html(opts.series[0].name.D); }
			if (opts.series[0].name.E) { $("#label5").html(opts.series[0].name.E); }
			if (opts.series[0].name.F) { $("#label6").html(opts.series[0].name.F); }
			
			// if values and data are given
			if (opts.series[0].hasOwnProperty("values") && opts.series[0].hasOwnProperty("data")) {
				setValuesforFillCountVenn(opts.series[0].values);
			// if only the data
			} else if (opts.series[0].hasOwnProperty("data")) {
				var values = {};
				for (var letter in opts.series[0].data) {
					values[letter] = opts.series[0].data[letter].length;
				}
				setValuesforFillCountVenn(values);
			// if only the values
			} else if(opts.series[0].hasOwnProperty("values")) {
				setValuesforFillCountVenn(opts.series[0].values);
			}

			// Add info to the number
            $("*[id^=resultC]").each(function(){
            	this.listnames = new Array();
            	for (var i=6; i<$(this).attr("id").length; i++) {
            		if ($(this).attr("id").substring(i+1,i+2) == "1") {
            			try {
            				if(i-6 == 0)		{ this.listnames.push(opts.series[0].name.A); }
            				else if(i-6 == 1)	{ this.listnames.push(opts.series[0].name.B); } 
            				else if(i-6 == 2)	{ this.listnames.push(opts.series[0].name.C); }
            				else if(i-6 == 3)	{ this.listnames.push(opts.series[0].name.D); }
            				else if(i-6 == 4)	{ this.listnames.push(opts.series[0].name.E); }
            				else if(i-6 == 5)	{ this.listnames.push(opts.series[0].name.F); }
            				}
            			catch(err) { }
            		}
            	}
            	// if data are provided
            	if (opts.series[0].hasOwnProperty("data")) {
            		var cvalue = "";
    				for (var i=6; i<$(this).attr("id").length; i++) {
    					if ($(this).attr("id").substring(i+1,i+2) == "1") {
    						if (i == 6) {cvalue += "A";}
    						else if (i == 7) {cvalue += "B";}
    						else if (i == 8) {cvalue += "C";}
    						else if (i == 9) {cvalue += "D";}
    						else if (i == 10) {cvalue += "E";}
    						else if (i == 11) {cvalue += "F";}
    					}
    				}
    				this.list = opts.series[0].data[cvalue];
					if (!opts.disableClick) {
						// Add some eventlistener
						$(this).mouseover(function(){
			            	$(this).addClass("number-over");
			            });
			            $(this).mouseout(function(){
			            	$(this).removeClass("number-over");
			            }); 
			            $(this).click(opts.fnClickCallback);
					}
            	}
					
				if($(this).text() > 0) {
            		$(this).removeClass("number-empty");
            	}
            });
            
		}
		
		function getVennType() {
			// If more than 1 sample, it's a list venn
			if (opts.series.length > 1) {
				return (new Array("list", opts.series.length));
			} else {
				if (opts.series[0] != undefined && opts.series[0].name.A) {
					var count = 0;
					for (i in opts.series[0].name){ count++; }
					return (new Array("count", count));
				} else {
					return (new Array("list", opts.series.length));
				}
			}
		}
		
		function addExportModule(div, extraheight, type){
			$t = div;
			
			var div_export = '<div id="module-export" style="position: relative; left:475px; top: -'+(415+extraheight)+'px; width: 25px; height: 20px;">';
			div_export += '<canvas id="canvasExport" style="border:1px solid white" width="25" height="20"></canvas>';
        	div_export += '<div id="menu" style="position: relative;width:150px; height:30px; display:none; right:123px; top:-4px;">';
        	div_export += '<div style="box-shadow: 3px 3px 10px rgb(136, 136, 136); border: 1px solid rgb(160, 160, 160); background: none repeat scroll 0% 0% rgb(255, 255, 255);padding: 5px 0px;">';
        	div_export += '<div id="format-png" style="padding: 0px 10px; background: none repeat scroll 0% 0% transparent; color: rgb(48, 48, 48); font-size: 12px;">Download PNG image</div>';
        	if (type == "list") {
        		div_export += '<div id="format-csv" style="padding: 0px 10px; background: none repeat scroll 0% 0% transparent; color: rgb(48, 48, 48); font-size: 12px;">Download CSV lists</div>';
        	}
        	div_export += '</div>';
			div_export += '</div>';
			div_export += '</div>';
			$t.append(div_export);
			
			//draw canvas button
			var canvas = $("#canvasExport")[0];
			var context = canvas.getContext("2d");
			for (i=0;i<3;i++){
				context.lineWidth = 3;
				context.beginPath();
				context.lineCap="round";
				context.moveTo(5,5+i*5.2);
				context.lineTo(20,5+i*5.2);
				context.strokeStyle = "#666";
				context.stroke();
			}		

			var select_form = $("#menu");
			var ceColorOri = $("#canvasExport").css('background');
			$("#canvasExport").click(function (event) {
				$(this).css('background', 'linear-gradient(to bottom, #AECEFF, white) repeat scroll 0 0 transparent');
				$(this).css('border', '1px solid #6688AA');
				$('#canvasExport').unbind('mouseenter mouseleave');
				select_form.show();
				if (select_form.is(":visible")){
					$(document).mouseup(function (event){
						if (select_form.has(event.target).length === 0){
							$("#canvasExport").css('background', ceColorOri);
							$("#canvasExport").css('border-color', "white");
							$("#canvasExport").hover(function() {
								$(this).css('background', 'linear-gradient(to bottom, white, #AECEFF) repeat scroll 0 0 transparent');
								$(this).css('border', '1px solid #6688AA');
								$(this).css('border-radius', '3px');
							}, function() {
								$(this).css('background', ceColorOri);
								$(this).css('border-color', "white");
							});
							select_form.hide();
						}
					});
				}
				var colorOrig=$("div[id^=format-]").css('background');
				$("div[id^=format-]").hover(function() {
					$(this).css('background', 'rgba(69,114,165,0.75)');
					$(this).css('color', 'white');
				}, function() {
					$(this).css('background', colorOrig);
					$(this).css('color', '');
				});
				$("#format-png").click(function(event) {
					select_form.hide();
					html2canvas($("#frame"), {
						onrendered: function(canvas) {
							var img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
							window.location.href = img;
						}
					});
				});
				$("#format-csv").click(function(event) {
					var	rawData = new Array(),
						comma = false;
					$("*[id^=resultC]").each(function(){
						if (!this.empty) {
							var	currentRow = new Array(),
								tmpline = this.listnames.join("|");
							
							if (tmpline.indexOf(',') >= 0) {
								comma = true;
								tmpline = tmpline.replace(/,/g, '_');
							}
							currentRow.push(tmpline);
							
							for (var i in this.list) {
								tmpline = this.list[i];
								if (this.list[i].indexOf(",") >= 0) {
									comma = true;
									tmpline = this.list[i].replace(/,/g, '_');
								}
								currentRow.push(tmpline);
							}
							rawData.push(currentRow);
						}
		            });
					var csvContent = "data:text/csv;charset=utf-8,";
					if(comma) {
						csvContent += "##\n## Warning: comma(s) have been replaced by underscore(s)\n##\n";
					}
					transpose(rawData).forEach(function(infoArray, index){
						dataString = infoArray.join(",");
						csvContent += index <= infoArray.length ? dataString+ "\n" : dataString;
					});
					var encodedUri = encodeURI(csvContent);
					window.open(encodedUri);
				});
			});
			$("#canvasExport").hover(function() {
				$(this).css('background', 'linear-gradient(to bottom, white, #AECEFF) repeat scroll 0 0 transparent');
				$(this).css('border', '1px solid #6688AA');
				$(this).css('border-radius', '3px');
			}, function() {
				$(this).css('background', ceColorOri);
				$(this).css('border-color', "white");
			});
		}
		
		function unselect( unselected_name, init ) {
			var init = (init == null ? true : init);
			var unselected_idx = null ;
			// Find group index
			$("*[id^=label]").each(function(){
				if( $(this).html() == unselected_name ) {
					$(this).css('opacity', 0.1);
					$(this).removeClass("is-selected");
					var id = $(this).attr('id');
					unselected_idx = id.charAt(id.length-1);
				}
			});
			// Change legend button
			legend_button = $("#item-" + unselected_idx) ;
			legend_button.children("span").css('margin-left', '0px');
			legend_button.css('opacity', 0.5);
			legend_button.children("span").text('off');
			// Change visibility
			var visible_id = "resultC000000";
			$(".is-selected").each(function(){
				var id = $(this).attr('id');
				var replace_pos = 6 + parseInt(id.charAt(id.length-1));
				visible_id = visible_id.substr(0, replace_pos) + 1 + visible_id.substr(replace_pos+1);
			});
			if (visible_id == "resultC000000" && init) { // 0 selected element and init
				$(".number-black").each(function(){
					$(this).css('opacity', 1);
				});
				$("*[id^=label]").each(function(){
					$(this).css('opacity', 0.6);
				});
			} else { // At least one selected element or non-init
				$(".number-black").each(function(){
					if( $(this).attr('id') == visible_id ) {
						$(this).css('opacity', 1);
					} else {
						$(this).css('opacity', 0.1);
					}
	        	});
			}
			return( visible_id );
		}
		
		function select( selected_name ) {
			var selected_idx = null ;
			// Find group index and show label
			$("*[id^=label]").each(function(){
				if( $(this).html() == selected_name ) {
					$(this).css('opacity', 0.6);
					$(this).addClass("is-selected");
					var id = $(this).attr('id');
					selected_idx = id.charAt(id.length-1);
				} else if (!$(this).hasClass("is-selected")) {
					$(this).css('opacity', 0.1);
				}
			});
			// Change legend button
			legend_button = $("#item-" + selected_idx);
			legend_button.children("span").css('margin-left', '13px');
			legend_button.css('opacity', 0.75);
			legend_button.css('color', 'black');
			legend_button.children("span").text('on');
			// Change count visibility
			var visible_idx = "resultC000000";
			$(".is-selected").each(function(){
				var id = $(this).attr('id');
				var replace_pos = 6 + parseInt(id.charAt(id.length-1));
				visible_idx = visible_idx.substr(0, replace_pos) + 1 + visible_idx.substr(replace_pos+1);
			});
			$(".number-black").each(function(){
				if( $(this).attr('id') == visible_idx ) {
					$(this).css('opacity', 1);
				} else {
					$(this).css('opacity', 0.1);
				}
        	});
			return( visible_idx );
		}

		function search( val, min_size ) {
			var min_size = (min_size == null ? 1 : min_size)
			var groups_status = new Array();
			var visible_id = "resultC000000";
			var nb_find = 0;
			$("*[id^=label]").each( function() {
				if ($(this).html() != "") {
					groups_status[$(this).html()] = 'unselected';
				}
			});
			
			if (val == "" || min_size > val.length) { // Search is empty
				for (var group_name in  groups_status) {
					visible_id = unselect( group_name );
				}
			} else { // Search element
				// Find selected
				var listnames = null ;
				var perfect_match = false;
				$(".number-black:not(.number-empty)").each( function() {
					for (var idx = 0 ; idx < this.list.length && !perfect_match ; idx++) {
						if (this.list[idx].indexOf(val) != -1) {
							if (this.list[idx] == val) {
								perfect_match = true;
							}
							listnames = this.listnames;
							nb_find++ ;
						}
					}
				});
				if (nb_find == 1  || perfect_match) {
					for ( var idx_2 = 0 ; idx_2 < listnames.length ; idx_2++ ) {
						groups_status[listnames[idx_2]] = 'selected' ;
					}
					nb_find = 1;
				}
				// Update if search is not ambiguous
				if (nb_find <= 1) { // Find or unfind
					for (var group_name in  groups_status) {
						if( groups_status[group_name] == 'selected' ) {
							visible_id = select( group_name );
						} else {
							visible_id = unselect( group_name, false );
						}
					}
				} else { // Ambiguous
					for (var group_name in  groups_status) {
						visible_id = unselect( group_name );
					}
				}
			}
			
			// Update status
			if( opts.searchStatus != null ) {
				if (val == "" || min_size > val.length) {
					opts.searchStatus.text( "" );
				} else if (nb_find == 0) {
					opts.searchStatus.text( "not found" );
				} else if (nb_find == 1) {
					opts.searchStatus.text( "found" );
				} else if (nb_find > 1) {
					opts.searchStatus.text( "ambiguous" );
				} 
			}
			
			// Display
			clearCanvas();
        	if (opts.displayMode == 'edwards') {
               	placeEdwardsVenn( getVennType()[1] );
            } else {
               	placeClassicVenn( getVennType()[1] );
            }
        	if (opts.displayStat) {
        		placeStat( getVennType()[1] );
            }
        	if (visible_id != "resultC000000") { 
        		$("#" + visible_id).show();
        	}
		}
		
        this.each(function() {
            var $t = $(this);
            var extraheight = 0;
            if (opts.displayStat) {
            	extraheight = 280; 
            }
            $t.css({"width": "500px", "height": ""+(450+extraheight)+"px"});
            $('<style>.number-black{font-weight:bold;color:#000000;text-decoration:none;font-size:12px;}.number-over{font-weight:bold;cursor:pointer;color:#0000FF;text-decoration:underline;}.number-empty{font-weight:normal;font-size:12px;}</style>').appendTo('body');
           
            var	legleft = 434,
            	legtop  = 130;
            if (opts.displayMode == 'edwards') {
            	legleft = 10;
            	legtop  = 425;
            }
            $('<style>.module-legend{border:1px solid lightgrey;border-radius:5px;position:relative;left:'+legleft+'px;top:-'+(legtop+extraheight)+'px;width:35px;padding-bottom:3px}</style>').appendTo('body');
            $('<style>.leg-items{padding-top:1px;margin:3px 3px 0px 3px;cursor:pointer;border: 1px solid grey;border-radius:2px;width:27px;height:11px;font-size:0.65em;line-height:10px;opacity:0.75}</style>').appendTo('body');
            
            var div_content = '<div id="frame" style="position: relative; left: 0pt; top: 5pt; width: 500px; height: "'+(445+extraheight)+'px;">';
			div_content += '<canvas id="canvasEllipse" width="500px" height="'+(415+extraheight)+'px;"></canvas>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111000"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111100"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111010"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111110"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC000111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC001111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC010111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC011111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC100111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC101111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC110111"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111001"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111011"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111101"></div>';
			div_content += '<div class="number-black" style="position: absolute; left: -1000px; top: -2200px;" id="resultC111111"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;"  id="label1"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;"  id="label2"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;" id="label3"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;"  id="label4"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;" id="label5"></div>';
			div_content += '<div style="position: absolute; left: -1000px; top: -1000px; opacity:0.5;" id="label6"></div>';
			div_content += '</div>';
            $t.html(div_content);
           
            // init with 0
            $("*[id^=resultC]").each(function(){
				$(this).html(0);
				$(this).addClass("number-empty");
			});
            
            var type = getVennType(); 
            if (type[0] == "list") {
            	fillListVenn();
            } else if (type[0] == "count") {
            	fillCountVenn();
            }
            
			if( opts.searchInput != null ) {
				opts.searchInput.keyup( function() {
					search( opts.searchInput.val(), opts.searchMinSize );
				});
			}
			
        	if (opts.displayMode == 'edwards') {
        		placeEdwardsVenn(type[1]);
        	} else {
        		placeClassicVenn(type[1]);
        	}
            if (opts.displayStat) {
            	placeStat(type[1]);
            }
            
            // if the exporting modul is requested
            if (opts.exporting === true){ addExportModule($t, extraheight, type[0]); }
            // if min 4 classes diagram is requested add legend
            if (type[1] >= 4) { addLegend($t, type[1]); }
            
            // number hover action
            $(".number-black").hover(
            	function(){
            		var activeleg = false;
            		$("*[id^=item]").each(function(){
            			if($(this).children("span").text() === 'on') { activeleg = true; }
            		});
            		var activesearch = false;
        			if(opts.searchInput.val() != '') { activesearch= true; }
            		if(!activeleg && !activesearch &&  $(this).text() !== "") {
		            	var labels  = this.listnames;
		            	var current = this;
	            		$("*[id^=label]").each(function(){
	            			if (labels.indexOf($(this).text()) < 0) {
	            				$(this).css('opacity', 0.1);
	            			} else {
	            				$(this).css('opacity', 0.6);
	            			}
	            		});
		            	$(".number-black").each(function(){
	                		if(this != current) {
	                			$(this).css('opacity', 0.1);
	                		}
	                	});
		            	clearCanvas();
		            	if (opts.displayMode == 'edwards') {
		                   	placeEdwardsVenn(type[1]);
		                } else {
		                   	placeClassicVenn(type[1]);
		                }
		            	if (opts.displayStat) {
		            		placeStat(type[1]);
		                }
            		}
            	},
            	function(){
            		var activeleg = false;
            		$("*[id^=item]").each(function(){
            			if($(this).children("span").text() === 'on') { activeleg = true; }
            		});
            		var activesearch = false;
            		if(opts.searchInput.val() != '') { activesearch= true; }
            		if(!activeleg && !activesearch && $(this).text() !== "") {
	            		var labels = this.listnames;
	                	$("*[id^=label]").each(function(){
	            			$(this).css('opacity', 0.5);
	                	});
	                	$(".number-black").each(function(){
	                		$(this).css('opacity', 1);
	                	});
	                	clearCanvas();
	                	if (opts.displayMode == 'edwards') {
	                       	placeEdwardsVenn(type[1]);
	                    } else {
	                       	placeClassicVenn(type[1]);
	                    }
	                	if (opts.displayStat) {
	                		placeStat(type[1]);
	                    }
            		}
            	}
            );
        });
        return this;
	};
})(jQuery);


/*
html2canvas 0.4.0 <http://html2canvas.hertzen.com>
Copyright (c) 2013 Niklas von Hertzen (@niklasvh)

Released under MIT License
*/
(function(window, document, undefined){

"use strict";

var _html2canvas = {},
previousElement,
computedCSS,
html2canvas;

function h2clog(a) {
if (_html2canvas.logging && window.console && window.console.log) {
  window.console.log(a);
}
}

_html2canvas.Util = {};

_html2canvas.Util.trimText = (function(isNative){
return function(input){
  if(isNative) { return isNative.apply( input ); }
  else { return ((input || '') + '').replace( /^\s+|\s+$/g , '' ); }
};
})( String.prototype.trim );

_html2canvas.Util.parseBackgroundImage = function (value) {
  var whitespace = ' \r\n\t',
      method, definition, prefix, prefix_i, block, results = [],
      c, mode = 0, numParen = 0, quote, args;

  var appendResult = function(){
      if(method) {
          if(definition.substr( 0, 1 ) === '"') {
              definition = definition.substr( 1, definition.length - 2 );
          }
          if(definition) {
              args.push(definition);
          }
          if(method.substr( 0, 1 ) === '-' &&
                  (prefix_i = method.indexOf( '-', 1 ) + 1) > 0) {
              prefix = method.substr( 0, prefix_i);
              method = method.substr( prefix_i );
          }
          results.push({
              prefix: prefix,
              method: method.toLowerCase(),
              value: block,
              args: args
          });
      }
      args = []; //for some odd reason, setting .length = 0 didn't work in safari
      method =
          prefix =
          definition =
          block = '';
  };

  appendResult();
  for(var i = 0, ii = value.length; i<ii; i++) {
      c = value[i];
      if(mode === 0 && whitespace.indexOf( c ) > -1){
          continue;
      }
      switch(c) {
          case '"':
              if(!quote) {
                  quote = c;
              }
              else if(quote === c) {
                  quote = null;
              }
              break;

          case '(':
              if(quote) { break; }
              else if(mode === 0) {
                  mode = 1;
                  block += c;
                  continue;
              } else {
                  numParen++;
              }
              break;

          case ')':
              if(quote) { break; }
              else if(mode === 1) {
                  if(numParen === 0) {
                      mode = 0;
                      block += c;
                      appendResult();
                      continue;
                  } else {
                      numParen--;
                  }
              }
              break;

          case ',':
              if(quote) { break; }
              else if(mode === 0) {
                  appendResult();
                  continue;
              }
              else if (mode === 1) {
                  if(numParen === 0 && !method.match(/^url$/i)) {
                      args.push(definition);
                      definition = '';
                      block += c;
                      continue;
                  }
              }
              break;
      }

      block += c;
      if(mode === 0) { method += c; }
      else { definition += c; }
  }
  appendResult();

  return results;
};

_html2canvas.Util.Bounds = function getBounds (el) {
var clientRect,
bounds = {};

if (el.getBoundingClientRect){
  clientRect = el.getBoundingClientRect();


  // TODO add scroll position to bounds, so no scrolling of window necessary
  bounds.top = clientRect.top;
  bounds.bottom = clientRect.bottom || (clientRect.top + clientRect.height);
  bounds.left = clientRect.left;

  // older IE doesn't have width/height, but top/bottom instead
  bounds.width = clientRect.width || (clientRect.right - clientRect.left);
  bounds.height = clientRect.height || (clientRect.bottom - clientRect.top);

  return bounds;

}
};

_html2canvas.Util.getCSS = function (el, attribute, index) {
// return $(el).css(attribute);

  var val,
  isBackgroundSizePosition = attribute.match( /^background(Size|Position)$/ );

function toPX( attribute, val ) {
  var rsLeft = el.runtimeStyle && el.runtimeStyle[ attribute ],
  left,
  style = el.style;

  // Check if we are not dealing with pixels, (Opera has issues with this)
  // Ported from jQuery css.js
  // From the awesome hack by Dean Edwards
  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

  // If we're not dealing with a regular pixel number
  // but a number that has a weird ending, we need to convert it to pixels

  if ( !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test( val ) && /^-?\d/.test( val ) ) {

    // Remember the original values
    left = style.left;

    // Put in the new values to get a computed value out
    if ( rsLeft ) {
      el.runtimeStyle.left = el.currentStyle.left;
    }
    style.left = attribute === "fontSize" ? "1em" : (val || 0);
    val = style.pixelLeft + "px";

    // Revert the changed values
    style.left = left;
    if ( rsLeft ) {
      el.runtimeStyle.left = rsLeft;
    }

  }

  if (!/^(thin|medium|thick)$/i.test( val )) {
    return Math.round(parseFloat( val )) + "px";
  }

  return val;
}

  if (previousElement !== el) {
    computedCSS = document.defaultView.getComputedStyle(el, null);
  }
  val = computedCSS[attribute];

  if (isBackgroundSizePosition) {
    val = (val || '').split( ',' );
    val = val[index || 0] || val[0] || 'auto';
    val = _html2canvas.Util.trimText(val).split(' ');

    if(attribute === 'backgroundSize' && (!val[ 0 ] || val[ 0 ].match( /cover|contain|auto/ ))) {
      //these values will be handled in the parent function

    } else {
      val[ 0 ] = ( val[ 0 ].indexOf( "%" ) === -1 ) ? toPX(  attribute + "X", val[ 0 ] ) : val[ 0 ];
      if(val[ 1 ] === undefined) {
        if(attribute === 'backgroundSize') {
          val[ 1 ] = 'auto';
          return val;
        }
        else {
          // IE 9 doesn't return double digit always
          val[ 1 ] = val[ 0 ];
        }
      }
      val[ 1 ] = ( val[ 1 ].indexOf( "%" ) === -1 ) ? toPX(  attribute + "Y", val[ 1 ] ) : val[ 1 ];
    }
  } else if ( /border(Top|Bottom)(Left|Right)Radius/.test( attribute) ) {
    var arr = val.split(" ");
    if ( arr.length <= 1 ) {
            arr[ 1 ] = arr[ 0 ];
    }
    arr[ 0 ] = parseInt( arr[ 0 ], 10 );
    arr[ 1 ] = parseInt( arr[ 1 ], 10 );
    val = arr;
  }

return val;
};

_html2canvas.Util.resizeBounds = function( current_width, current_height, target_width, target_height, stretch_mode ){
var target_ratio = target_width / target_height,
  current_ratio = current_width / current_height,
  output_width, output_height;

if(!stretch_mode || stretch_mode === 'auto') {
  output_width = target_width;
  output_height = target_height;

} else {
  if(target_ratio < current_ratio ^ stretch_mode === 'contain') {
    output_height = target_height;
    output_width = target_height * current_ratio;
  } else {
    output_width = target_width;
    output_height = target_width / current_ratio;
  }
}

return { width: output_width, height: output_height };
};

function backgroundBoundsFactory( prop, el, bounds, image, imageIndex, backgroundSize ) {
  var bgposition =  _html2canvas.Util.getCSS( el, prop, imageIndex ) ,
  topPos,
  left,
  percentage,
  val;

  if (bgposition.length === 1){
    val = bgposition[0];

    bgposition = [];

    bgposition[0] = val;
    bgposition[1] = val;
  }

  if (bgposition[0].toString().indexOf("%") !== -1){
    percentage = (parseFloat(bgposition[0])/100);
    left = bounds.width * percentage;
    if(prop !== 'backgroundSize') {
      left -= (backgroundSize || image).width*percentage;
    }

  } else {
    if(prop === 'backgroundSize') {
      if(bgposition[0] === 'auto') {
        left = image.width;

      } else {
        if(bgposition[0].match(/contain|cover/)) {
          var resized = _html2canvas.Util.resizeBounds( image.width, image.height, bounds.width, bounds.height, bgposition[0] );
          left = resized.width;
          topPos = resized.height;
        } else {
          left = parseInt (bgposition[0], 10 );
        }
      }

    } else {
      left = parseInt( bgposition[0], 10 );
    }
  }


  if(bgposition[1] === 'auto') {
    topPos = left / image.width * image.height;
  } else if (bgposition[1].toString().indexOf("%") !== -1){
    percentage = (parseFloat(bgposition[1])/100);
    topPos =  bounds.height * percentage;
    if(prop !== 'backgroundSize') {
      topPos -= (backgroundSize || image).height * percentage;
    }

  } else {
    topPos = parseInt(bgposition[1],10);
  }

  return [left, topPos];
}

_html2canvas.Util.BackgroundPosition = function( el, bounds, image, imageIndex, backgroundSize ) {
  var result = backgroundBoundsFactory( 'backgroundPosition', el, bounds, image, imageIndex, backgroundSize );
  return { left: result[0], top: result[1] };
};
_html2canvas.Util.BackgroundSize = function( el, bounds, image, imageIndex ) {
  var result = backgroundBoundsFactory( 'backgroundSize', el, bounds, image, imageIndex );
  return { width: result[0], height: result[1] };
};

_html2canvas.Util.Extend = function (options, defaults) {
for (var key in options) {
  if (options.hasOwnProperty(key)) {
    defaults[key] = options[key];
  }
}
return defaults;
};


/*
* Derived from jQuery.contents()
* Copyright 2010, John Resig
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://jquery.org/license
*/
_html2canvas.Util.Children = function( elem ) {


var children;
try {

  children = (elem.nodeName && elem.nodeName.toUpperCase() === "IFRAME") ?
  elem.contentDocument || elem.contentWindow.document : (function( array ){
    var ret = [];

    if ( array !== null ) {

      (function( first, second ) {
        var i = first.length,
        j = 0;

        if ( typeof second.length === "number" ) {
          for ( var l = second.length; j < l; j++ ) {
            first[ i++ ] = second[ j ];
          }

        } else {
          while ( second[j] !== undefined ) {
            first[ i++ ] = second[ j++ ];
          }
        }

        first.length = i;

        return first;
      })( ret, array );

    }

    return ret;
  })( elem.childNodes );

} catch (ex) {
  h2clog("html2canvas.Util.Children failed with exception: " + ex.message);
  children = [];
}
return children;
};

_html2canvas.Util.Font = (function () {

var fontData = {};

return function(font, fontSize, doc) {
  if (fontData[font + "-" + fontSize] !== undefined) {
    return fontData[font + "-" + fontSize];
  }

  var container = doc.createElement('div'),
  img = doc.createElement('img'),
  span = doc.createElement('span'),
  sampleText = 'Hidden Text',
  baseline,
  middle,
  metricsObj;

  container.style.visibility = "hidden";
  container.style.fontFamily = font;
  container.style.fontSize = fontSize;
  container.style.margin = 0;
  container.style.padding = 0;

  doc.body.appendChild(container);

  // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever (handtinywhite.gif)
  img.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";
  img.width = 1;
  img.height = 1;

  img.style.margin = 0;
  img.style.padding = 0;
  img.style.verticalAlign = "baseline";

  span.style.fontFamily = font;
  span.style.fontSize = fontSize;
  span.style.margin = 0;
  span.style.padding = 0;

  span.appendChild(doc.createTextNode(sampleText));
  container.appendChild(span);
  container.appendChild(img);
  baseline = (img.offsetTop - span.offsetTop) + 1;

  container.removeChild(span);
  container.appendChild(doc.createTextNode(sampleText));

  container.style.lineHeight = "normal";
  img.style.verticalAlign = "super";

  middle = (img.offsetTop-container.offsetTop) + 1;
  metricsObj = {
    baseline: baseline,
    lineWidth: 1,
    middle: middle
  };

  fontData[font + "-" + fontSize] = metricsObj;

  doc.body.removeChild(container);

  return metricsObj;
};
})();

(function(){

_html2canvas.Generate = {};

var reGradients = [
/^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
/^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,
/^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,
/^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,
/^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,
/^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,
/^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/
];

/*
* TODO: Add IE10 vendor prefix (-ms) support
* TODO: Add W3C gradient (linear-gradient) support
* TODO: Add old Webkit -webkit-gradient(radial, ...) support
* TODO: Maybe some RegExp optimizations are possible ;o)
*/
_html2canvas.Generate.parseGradient = function(css, bounds) {
  var gradient, i, len = reGradients.length, m1, stop, m2, m2Len, step, m3, tl,tr,br,bl;

  for(i = 0; i < len; i+=1){
    m1 = css.match(reGradients[i]);
    if(m1) {
      break;
    }
  }

  if(m1) {
    switch(m1[1]) {
      case '-webkit-linear-gradient':
      case '-o-linear-gradient':

        gradient = {
          type: 'linear',
          x0: null,
          y0: null,
          x1: null,
          y1: null,
          colorStops: []
        };

        // get coordinates
        m2 = m1[2].match(/\w+/g);
        if(m2){
          m2Len = m2.length;
          for(i = 0; i < m2Len; i+=1){
            switch(m2[i]) {
              case 'top':
                gradient.y0 = 0;
                gradient.y1 = bounds.height;
                break;

              case 'right':
                gradient.x0 = bounds.width;
                gradient.x1 = 0;
                break;

              case 'bottom':
                gradient.y0 = bounds.height;
                gradient.y1 = 0;
                break;

              case 'left':
                gradient.x0 = 0;
                gradient.x1 = bounds.width;
                break;
            }
          }
        }
        if(gradient.x0 === null && gradient.x1 === null){ // center
          gradient.x0 = gradient.x1 = bounds.width / 2;
        }
        if(gradient.y0 === null && gradient.y1 === null){ // center
          gradient.y0 = gradient.y1 = bounds.height / 2;
        }

        // get colors and stops
        m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
        if(m2){
          m2Len = m2.length;
          step = 1 / Math.max(m2Len - 1, 1);
          for(i = 0; i < m2Len; i+=1){
            m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
            if(m3[2]){
              stop = parseFloat(m3[2]);
              if(m3[3] === '%'){
                stop /= 100;
              } else { // px - stupid opera
                stop /= bounds.width;
              }
            } else {
              stop = i * step;
            }
            gradient.colorStops.push({
              color: m3[1],
              stop: stop
            });
          }
        }
        break;

      case '-webkit-gradient':

        gradient = {
          type: m1[2] === 'radial' ? 'circle' : m1[2], // TODO: Add radial gradient support for older mozilla definitions
          x0: 0,
          y0: 0,
          x1: 0,
          y1: 0,
          colorStops: []
        };

        // get coordinates
        m2 = m1[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);
        if(m2){
          gradient.x0 = (m2[1] * bounds.width) / 100;
          gradient.y0 = (m2[2] * bounds.height) / 100;
          gradient.x1 = (m2[3] * bounds.width) / 100;
          gradient.y1 = (m2[4] * bounds.height) / 100;
        }

        // get colors and stops
        m2 = m1[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);
        if(m2){
          m2Len = m2.length;
          for(i = 0; i < m2Len; i+=1){
            m3 = m2[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);
            stop = parseFloat(m3[2]);
            if(m3[1] === 'from') {
              stop = 0.0;
            }
            if(m3[1] === 'to') {
              stop = 1.0;
            }
            gradient.colorStops.push({
              color: m3[3],
              stop: stop
            });
          }
        }
        break;

      case '-moz-linear-gradient':

        gradient = {
          type: 'linear',
          x0: 0,
          y0: 0,
          x1: 0,
          y1: 0,
          colorStops: []
        };

        // get coordinates
        m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);

        // m2[1] == 0%   -> left
        // m2[1] == 50%  -> center
        // m2[1] == 100% -> right

        // m2[2] == 0%   -> top
        // m2[2] == 50%  -> center
        // m2[2] == 100% -> bottom

        if(m2){
          gradient.x0 = (m2[1] * bounds.width) / 100;
          gradient.y0 = (m2[2] * bounds.height) / 100;
          gradient.x1 = bounds.width - gradient.x0;
          gradient.y1 = bounds.height - gradient.y0;
        }

        // get colors and stops
        m2 = m1[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);
        if(m2){
          m2Len = m2.length;
          step = 1 / Math.max(m2Len - 1, 1);
          for(i = 0; i < m2Len; i+=1){
            m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);
            if(m3[2]){
              stop = parseFloat(m3[2]);
              if(m3[3]){ // percentage
                stop /= 100;
              }
            } else {
              stop = i * step;
            }
            gradient.colorStops.push({
              color: m3[1],
              stop: stop
            });
          }
        }
        break;

      case '-webkit-radial-gradient':
      case '-moz-radial-gradient':
      case '-o-radial-gradient':

        gradient = {
          type: 'circle',
          x0: 0,
          y0: 0,
          x1: bounds.width,
          y1: bounds.height,
          cx: 0,
          cy: 0,
          rx: 0,
          ry: 0,
          colorStops: []
        };

        // center
        m2 = m1[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);
        if(m2){
          gradient.cx = (m2[1] * bounds.width) / 100;
          gradient.cy = (m2[2] * bounds.height) / 100;
        }

        // size
        m2 = m1[3].match(/\w+/);
        m3 = m1[4].match(/[a-z\-]*/);
        if(m2 && m3){
          switch(m3[0]){
            case 'farthest-corner':
            case 'cover': // is equivalent to farthest-corner
            case '': // mozilla removes "cover" from definition :(
              tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
              tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
              br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
              bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
              gradient.rx = gradient.ry = Math.max(tl, tr, br, bl);
              break;
            case 'closest-corner':
              tl = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.cy, 2));
              tr = Math.sqrt(Math.pow(gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
              br = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.y1 - gradient.cy, 2));
              bl = Math.sqrt(Math.pow(gradient.x1 - gradient.cx, 2) + Math.pow(gradient.cy, 2));
              gradient.rx = gradient.ry = Math.min(tl, tr, br, bl);
              break;
            case 'farthest-side':
              if(m2[0] === 'circle'){
                gradient.rx = gradient.ry = Math.max(
                  gradient.cx,
                  gradient.cy,
                  gradient.x1 - gradient.cx,
                  gradient.y1 - gradient.cy
                  );
              } else { // ellipse

                gradient.type = m2[0];

                gradient.rx = Math.max(
                  gradient.cx,
                  gradient.x1 - gradient.cx
                  );
                gradient.ry = Math.max(
                  gradient.cy,
                  gradient.y1 - gradient.cy
                  );
              }
              break;
            case 'closest-side':
            case 'contain': // is equivalent to closest-side
              if(m2[0] === 'circle'){
                gradient.rx = gradient.ry = Math.min(
                  gradient.cx,
                  gradient.cy,
                  gradient.x1 - gradient.cx,
                  gradient.y1 - gradient.cy
                  );
              } else { // ellipse

                gradient.type = m2[0];

                gradient.rx = Math.min(
                  gradient.cx,
                  gradient.x1 - gradient.cx
                  );
                gradient.ry = Math.min(
                  gradient.cy,
                  gradient.y1 - gradient.cy
                  );
              }
              break;

          // TODO: add support for "30px 40px" sizes (webkit only)
          }
        }

        // color stops
        m2 = m1[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);
        if(m2){
          m2Len = m2.length;
          step = 1 / Math.max(m2Len - 1, 1);
          for(i = 0; i < m2Len; i+=1){
            m3 = m2[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);
            if(m3[2]){
              stop = parseFloat(m3[2]);
              if(m3[3] === '%'){
                stop /= 100;
              } else { // px - stupid opera
                stop /= bounds.width;
              }
            } else {
              stop = i * step;
            }
            gradient.colorStops.push({
              color: m3[1],
              stop: stop
            });
          }
        }
        break;
    }
  }

  return gradient;
};

_html2canvas.Generate.Gradient = function(src, bounds) {
  if(bounds.width === 0 || bounds.height === 0) {
    return;
  }

  var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  gradient, grad, i, len;

  canvas.width = bounds.width;
  canvas.height = bounds.height;

  // TODO: add support for multi defined background gradients
  gradient = _html2canvas.Generate.parseGradient(src, bounds);

  if(gradient) {
    if(gradient.type === 'linear') {
      grad = ctx.createLinearGradient(gradient.x0, gradient.y0, gradient.x1, gradient.y1);

      for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
        try {
          grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
        }
        catch(e) {
          h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
        }
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, bounds.width, bounds.height);

    } else if(gradient.type === 'circle') {

      grad = ctx.createRadialGradient(gradient.cx, gradient.cy, 0, gradient.cx, gradient.cy, gradient.rx);

      for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
        try {
          grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
        }
        catch(e) {
          h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
        }
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, bounds.width, bounds.height);

    } else if(gradient.type === 'ellipse') {

      // draw circle
      var canvasRadial = document.createElement('canvas'),
      ctxRadial = canvasRadial.getContext('2d'),
      ri = Math.max(gradient.rx, gradient.ry),
      di = ri * 2, imgRadial;

      canvasRadial.width = canvasRadial.height = di;

      grad = ctxRadial.createRadialGradient(gradient.rx, gradient.ry, 0, gradient.rx, gradient.ry, ri);

      for (i = 0, len = gradient.colorStops.length; i < len; i+=1) {
        try {
          grad.addColorStop(gradient.colorStops[i].stop, gradient.colorStops[i].color);
        }
        catch(e) {
          h2clog(['failed to add color stop: ', e, '; tried to add: ', gradient.colorStops[i], '; stop: ', i, '; in: ', src]);
        }
      }

      ctxRadial.fillStyle = grad;
      ctxRadial.fillRect(0, 0, di, di);

      ctx.fillStyle = gradient.colorStops[i - 1].color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasRadial, gradient.cx - gradient.rx, gradient.cy - gradient.ry, 2 * gradient.rx, 2 * gradient.ry);

    }
  }

  return canvas;
};

_html2canvas.Generate.ListAlpha = function(number) {
  var tmp = "",
  modulus;

  do {
    modulus = number % 26;
    tmp = String.fromCharCode((modulus) + 64) + tmp;
    number = number / 26;
  }while((number*26) > 26);

  return tmp;
};

_html2canvas.Generate.ListRoman = function(number) {
  var romanArray = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
  decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
  roman = "",
  v,
  len = romanArray.length;

  if (number <= 0 || number >= 4000) {
    return number;
  }

  for (v=0; v < len; v+=1) {
    while (number >= decimal[v]) {
      number -= decimal[v];
      roman += romanArray[v];
    }
  }

  return roman;

};

})();
function h2cRenderContext(width, height) {
var storage = [];
return {
  storage: storage,
  width: width,
  height: height,
  clip: function() {
    storage.push({
      type: "function",
      name: "clip",
      'arguments': arguments
    });
  },
  translate: function() {
    storage.push({
      type: "function",
      name: "translate",
      'arguments': arguments
    });
  },
  fill: function() {
    storage.push({
      type: "function",
      name: "fill",
      'arguments': arguments
    });
  },
  save: function() {
    storage.push({
      type: "function",
      name: "save",
      'arguments': arguments
    });
  },
  restore: function() {
    storage.push({
      type: "function",
      name: "restore",
      'arguments': arguments
    });
  },
  fillRect: function () {
    storage.push({
      type: "function",
      name: "fillRect",
      'arguments': arguments
    });
  },
  createPattern: function() {
    storage.push({
      type: "function",
      name: "createPattern",
      'arguments': arguments
    });
  },
  drawShape: function() {

    var shape = [];

    storage.push({
      type: "function",
      name: "drawShape",
      'arguments': shape
    });

    return {
      moveTo: function() {
        shape.push({
          name: "moveTo",
          'arguments': arguments
        });
      },
      lineTo: function() {
        shape.push({
          name: "lineTo",
          'arguments': arguments
        });
      },
      arcTo: function() {
        shape.push({
          name: "arcTo",
          'arguments': arguments
        });
      },
      bezierCurveTo: function() {
        shape.push({
          name: "bezierCurveTo",
          'arguments': arguments
        });
      },
      quadraticCurveTo: function() {
        shape.push({
          name: "quadraticCurveTo",
          'arguments': arguments
        });
      }
    };

  },
  drawImage: function () {
    storage.push({
      type: "function",
      name: "drawImage",
      'arguments': arguments
    });
  },
  fillText: function () {
    storage.push({
      type: "function",
      name: "fillText",
      'arguments': arguments
    });
  },
  setVariable: function (variable, value) {
    storage.push({
      type: "variable",
      name: variable,
      'arguments': value
    });
  }
};
}
_html2canvas.Parse = function (images, options) {
window.scroll(0,0);

var element = (( options.elements === undefined ) ? document.body : options.elements[0]), // select body by default
numDraws = 0,
doc = element.ownerDocument,
support = _html2canvas.Util.Support(options, doc),
ignoreElementsRegExp = new RegExp("(" + options.ignoreElements + ")"),
body = doc.body,
getCSS = _html2canvas.Util.getCSS,
pseudoHide = "___html2canvas___pseudoelement",
hidePseudoElements = doc.createElement('style');

hidePseudoElements.innerHTML = '.' + pseudoHide + '-before:before { content: "" !important; display: none !important; }' +
'.' + pseudoHide + '-after:after { content: "" !important; display: none !important; }';

body.appendChild(hidePseudoElements);

images = images || {};

function documentWidth () {
  return Math.max(
    Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
    Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
    Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
    );
}

function documentHeight () {
  return Math.max(
    Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
    Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
    Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    );
}

function getCSSInt(element, attribute) {
  var val = parseInt(getCSS(element, attribute), 10);
  return (isNaN(val)) ? 0 : val; // borders in old IE are throwing 'medium' for demo.html
}

function renderRect (ctx, x, y, w, h, bgcolor) {
  if (bgcolor !== "transparent"){
    ctx.setVariable("fillStyle", bgcolor);
    ctx.fillRect(x, y, w, h);
    numDraws+=1;
  }
}

function textTransform (text, transform) {
  switch(transform){
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text.replace( /(^|\s|:|-|\(|\))([a-z])/g , function (m, p1, p2) {
        if (m.length > 0) {
          return p1 + p2.toUpperCase();
        }
      } );
    case "uppercase":
      return text.toUpperCase();
    default:
      return text;
  }
}

function noLetterSpacing(letter_spacing) {
  return (/^(normal|none|0px)$/.test(letter_spacing));
}

function drawText(currentText, x, y, ctx){
  if (currentText !== null && _html2canvas.Util.trimText(currentText).length > 0) {
    ctx.fillText(currentText, x, y);
    numDraws+=1;
  }
}

function setTextVariables(ctx, el, text_decoration, color) {
  var align = false,
  bold = getCSS(el, "fontWeight"),
  family = getCSS(el, "fontFamily"),
  size = getCSS(el, "fontSize");

  switch(parseInt(bold, 10)){
    case 401:
      bold = "bold";
      break;
    case 400:
      bold = "normal";
      break;
  }

  ctx.setVariable("fillStyle", color);
  ctx.setVariable("font", [getCSS(el, "fontStyle"), getCSS(el, "fontVariant"), bold, size, family].join(" "));
  ctx.setVariable("textAlign", (align) ? "right" : "left");

  if (text_decoration !== "none"){
    return _html2canvas.Util.Font(family, size, doc);
  }
}

function renderTextDecoration(ctx, text_decoration, bounds, metrics, color) {
  switch(text_decoration) {
    case "underline":
      // Draws a line at the baseline of the font
      // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
      renderRect(ctx, bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, color);
      break;
    case "overline":
      renderRect(ctx, bounds.left, Math.round(bounds.top), bounds.width, 1, color);
      break;
    case "line-through":
      // TODO try and find exact position for line-through
      renderRect(ctx, bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, color);
      break;
  }
}

function getTextBounds(state, text, textDecoration, isLast) {
  var bounds;
  if (support.rangeBounds) {
    if (textDecoration !== "none" || _html2canvas.Util.trimText(text).length !== 0) {
      bounds = textRangeBounds(text, state.node, state.textOffset);
    }
    state.textOffset += text.length;
  } else if (state.node && typeof state.node.nodeValue === "string" ){
    var newTextNode = (isLast) ? state.node.splitText(text.length) : null;
    bounds = textWrapperBounds(state.node);
    state.node = newTextNode;
  }
  return bounds;
}

function textRangeBounds(text, textNode, textOffset) {
  var range = doc.createRange();
  range.setStart(textNode, textOffset);
  range.setEnd(textNode, textOffset + text.length);
  return range.getBoundingClientRect();
}

function textWrapperBounds(oldTextNode) {
  var parent = oldTextNode.parentNode,
  wrapElement = doc.createElement('wrapper'),
  backupText = oldTextNode.cloneNode(true);

  wrapElement.appendChild(oldTextNode.cloneNode(true));
  parent.replaceChild(wrapElement, oldTextNode);

  var bounds = _html2canvas.Util.Bounds(wrapElement);
  parent.replaceChild(backupText, wrapElement);
  return bounds;
}

function renderText(el, textNode, stack) {
  var ctx = stack.ctx,
  color = getCSS(el, "color"),
  textDecoration = getCSS(el, "textDecoration"),
  textAlign = getCSS(el, "textAlign"),
  metrics,
  textList,
  state = {
    node: textNode,
    textOffset: 0
  };

  if (_html2canvas.Util.trimText(textNode.nodeValue).length > 0) {
    textNode.nodeValue = textTransform(textNode.nodeValue, getCSS(el, "textTransform"));
    textAlign = textAlign.replace(["-webkit-auto"],["auto"]);

    textList = (!options.letterRendering && /^(left|right|justify|auto)$/.test(textAlign) && noLetterSpacing(getCSS(el, "letterSpacing"))) ?
    textNode.nodeValue.split(/(\b| )/)
    : textNode.nodeValue.split("");

    metrics = setTextVariables(ctx, el, textDecoration, color);

    if (options.chinese) {
      textList.forEach(function(word, index) {
        if (/.*[\u4E00-\u9FA5].*$/.test(word)) {
          word = word.split("");
          word.unshift(index, 1);
          textList.splice.apply(textList, word);
        }
      });
    }

    textList.forEach(function(text, index) {
      var bounds = getTextBounds(state, text, textDecoration, (index < textList.length - 1));
      if (bounds) {
        drawText(text, bounds.left, bounds.bottom, ctx);
        renderTextDecoration(ctx, textDecoration, bounds, metrics, color);
      }
    });
  }
}

function listPosition (element, val) {
  var boundElement = doc.createElement( "boundelement" ),
  originalType,
  bounds;

  boundElement.style.display = "inline";

  originalType = element.style.listStyleType;
  element.style.listStyleType = "none";

  boundElement.appendChild(doc.createTextNode(val));

  element.insertBefore(boundElement, element.firstChild);

  bounds = _html2canvas.Util.Bounds(boundElement);
  element.removeChild(boundElement);
  element.style.listStyleType = originalType;
  return bounds;
}

function elementIndex( el ) {
  var i = -1,
  count = 1,
  childs = el.parentNode.childNodes;

  if (el.parentNode) {
    while( childs[ ++i ] !== el ) {
      if ( childs[ i ].nodeType === 1 ) {
        count++;
      }
    }
    return count;
  } else {
    return -1;
  }
}

function listItemText(element, type) {
  var currentIndex = elementIndex(element),
  text;
  switch(type){
    case "decimal":
      text = currentIndex;
      break;
    case "decimal-leading-zero":
      text = (currentIndex.toString().length === 1) ? currentIndex = "0" + currentIndex.toString() : currentIndex.toString();
      break;
    case "upper-roman":
      text = _html2canvas.Generate.ListRoman( currentIndex );
      break;
    case "lower-roman":
      text = _html2canvas.Generate.ListRoman( currentIndex ).toLowerCase();
      break;
    case "lower-alpha":
      text = _html2canvas.Generate.ListAlpha( currentIndex ).toLowerCase();
      break;
    case "upper-alpha":
      text = _html2canvas.Generate.ListAlpha( currentIndex );
      break;
  }

  text += ". ";
  return text;
}

function renderListItem(element, stack, elBounds) {
  var x,
  text,
  ctx = stack.ctx,
  type = getCSS(element, "listStyleType"),
  listBounds;

  if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(type)) {
    text = listItemText(element, type);
    listBounds = listPosition(element, text);
    setTextVariables(ctx, element, "none", getCSS(element, "color"));

    if (getCSS(element, "listStylePosition") === "inside") {
      ctx.setVariable("textAlign", "left");
      x = elBounds.left;
    } else {
      return;
    }

    drawText(text, x, listBounds.bottom, ctx);
  }
}

function loadImage (src){
  var img = images[src];
  if (img && img.succeeded === true) {
    return img.img;
  } else {
    return false;
  }
}

function clipBounds(src, dst){
  var x = Math.max(src.left, dst.left),
  y = Math.max(src.top, dst.top),
  x2 = Math.min((src.left + src.width), (dst.left + dst.width)),
  y2 = Math.min((src.top + src.height), (dst.top + dst.height));

  return {
    left:x,
    top:y,
    width:x2-x,
    height:y2-y
  };
}

function setZ(zIndex, parentZ){
  // TODO fix static elements overlapping relative/absolute elements under same stack, if they are defined after them
  var newContext;
  if (!parentZ){
    newContext = h2czContext(0);
    return newContext;
  }

  if (zIndex !== "auto"){
    newContext = h2czContext(zIndex);
    parentZ.children.push(newContext);
    return newContext;

  }

  return parentZ;
}

function renderImage(ctx, element, image, bounds, borders) {

  var paddingLeft = getCSSInt(element, 'paddingLeft'),
  paddingTop = getCSSInt(element, 'paddingTop'),
  paddingRight = getCSSInt(element, 'paddingRight'),
  paddingBottom = getCSSInt(element, 'paddingBottom');

  drawImage(
    ctx,
    image,
    0, //sx
    0, //sy
    image.width, //sw
    image.height, //sh
    bounds.left + paddingLeft + borders[3].width, //dx
    bounds.top + paddingTop + borders[0].width, // dy
    bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight), //dw
    bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom) //dh
    );
}

function getBorderData(element) {
  return ["Top", "Right", "Bottom", "Left"].map(function(side) {
    return {
      width: getCSSInt(element, 'border' + side + 'Width'),
      color: getCSS(element, 'border' + side + 'Color')
    };
  });
}

function getBorderRadiusData(element) {
  return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
    return getCSS(element, 'border' + side + 'Radius');
  });
}

var getCurvePoints = (function(kappa) {

  return function(x, y, r1, r2) {
    var ox = (r1) * kappa, // control point offset horizontal
    oy = (r2) * kappa, // control point offset vertical
    xm = x + r1, // x-middle
    ym = y + r2; // y-middle
    return {
      topLeft: bezierCurve({
        x:x,
        y:ym
      }, {
        x:x,
        y:ym - oy
      }, {
        x:xm - ox,
        y:y
      }, {
        x:xm,
        y:y
      }),
      topRight: bezierCurve({
        x:x,
        y:y
      }, {
        x:x + ox,
        y:y
      }, {
        x:xm,
        y:ym - oy
      }, {
        x:xm,
        y:ym
      }),
      bottomRight: bezierCurve({
        x:xm,
        y:y
      }, {
        x:xm,
        y:y + oy
      }, {
        x:x + ox,
        y:ym
      }, {
        x:x,
        y:ym
      }),
      bottomLeft: bezierCurve({
        x:xm,
        y:ym
      }, {
        x:xm - ox,
        y:ym
      }, {
        x:x,
        y:y + oy
      }, {
        x:x,
        y:y
      })
    };
  };
})(4 * ((Math.sqrt(2) - 1) / 3));

function bezierCurve(start, startControl, endControl, end) {

  var lerp = function (a, b, t) {
    return {
      x:a.x + (b.x - a.x) * t,
      y:a.y + (b.y - a.y) * t
    };
  };

  return {
    start: start,
    startControl: startControl,
    endControl: endControl,
    end: end,
    subdivide: function(t) {
      var ab = lerp(start, startControl, t),
      bc = lerp(startControl, endControl, t),
      cd = lerp(endControl, end, t),
      abbc = lerp(ab, bc, t),
      bccd = lerp(bc, cd, t),
      dest = lerp(abbc, bccd, t);
      return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
    },
    curveTo: function(borderArgs) {
      borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
    },
    curveToReversed: function(borderArgs) {
      borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
    }
  };
}

function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
    corner1[0].curveTo(borderArgs);
    corner1[1].curveTo(borderArgs);
  } else {
    borderArgs.push(["line", x, y]);
  }

  if (radius2[0] > 0 || radius2[1] > 0) {
    borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
  }
}

function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
  var borderArgs = [];

  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
    outer1[1].curveTo(borderArgs);
  } else {
    borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
  }

  if (radius2[0] > 0 || radius2[1] > 0) {
    borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
    outer2[0].curveTo(borderArgs);
    borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
    inner2[0].curveToReversed(borderArgs);
  } else {
    borderArgs.push([ "line", borderData.c2[0], borderData.c2[1]]);
    borderArgs.push([ "line", borderData.c3[0], borderData.c3[1]]);
  }

  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
    inner1[1].curveToReversed(borderArgs);
  } else {
    borderArgs.push([ "line", borderData.c4[0], borderData.c4[1]]);
  }

  return borderArgs;
}

function calculateCurvePoints(bounds, borderRadius, borders) {

  var x = bounds.left,
  y = bounds.top,
  width = bounds.width,
  height = bounds.height,

  tlh = borderRadius[0][0],
  tlv = borderRadius[0][1],
  trh = borderRadius[1][0],
  trv = borderRadius[1][1],
  brv = borderRadius[2][0],
  brh = borderRadius[2][1],
  blh = borderRadius[3][0],
  blv = borderRadius[3][1],

  topWidth = width - trh,
  rightHeight = height - brv,
  bottomWidth = width - brh,
  leftHeight = height - blv;

  return {
    topLeftOuter: getCurvePoints(
      x,
      y,
      tlh,
      tlv
      ).topLeft.subdivide(0.5),

    topLeftInner: getCurvePoints(
      x + borders[3].width,
      y + borders[0].width,
      Math.max(0, tlh - borders[3].width),
      Math.max(0, tlv - borders[0].width)
      ).topLeft.subdivide(0.5),

    topRightOuter: getCurvePoints(
      x + topWidth,
      y,
      trh,
      trv
      ).topRight.subdivide(0.5),

    topRightInner: getCurvePoints(
      x + Math.min(topWidth, width + borders[3].width),
      y + borders[0].width,
      (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width,
      trv - borders[0].width
      ).topRight.subdivide(0.5),

    bottomRightOuter: getCurvePoints(
      x + bottomWidth,
      y + rightHeight,
      brh,
      brv
      ).bottomRight.subdivide(0.5),

    bottomRightInner: getCurvePoints(
      x + Math.min(bottomWidth, width + borders[3].width),
      y + Math.min(rightHeight, height + borders[0].width),
      Math.max(0, brh - borders[1].width),
      Math.max(0, brv - borders[2].width)
      ).bottomRight.subdivide(0.5),

    bottomLeftOuter: getCurvePoints(
      x,
      y + leftHeight,
      blh,
      blv
      ).bottomLeft.subdivide(0.5),

    bottomLeftInner: getCurvePoints(
      x + borders[3].width,
      y + leftHeight,
      Math.max(0, blh - borders[3].width),
      Math.max(0, blv - borders[2].width)
      ).bottomLeft.subdivide(0.5)
  };
}

function getBorderClip(element, borderPoints, borders, radius, bounds) {
  var backgroundClip = getCSS(element, 'backgroundClip'),
  borderArgs = [];

  switch(backgroundClip) {
    case "content-box":
    case "padding-box":
      parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
      parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
      parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
      parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
      break;

    default:
      parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
      parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
      parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
      parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
      break;
  }

  return borderArgs;
}

function parseBorders(element, bounds, borders){
  var x = bounds.left,
  y = bounds.top,
  width = bounds.width,
  height = bounds.height,
  borderSide,
  bx,
  by,
  bw,
  bh,
  borderArgs,
  // http://www.w3.org/TR/css3-background/#the-border-radius
  borderRadius = getBorderRadiusData(element),
  borderPoints = calculateCurvePoints(bounds, borderRadius, borders),
  borderData = {
    clip: getBorderClip(element, borderPoints, borders, borderRadius, bounds),
    borders: []
  };

  for (borderSide = 0; borderSide < 4; borderSide++) {

    if (borders[borderSide].width > 0) {
      bx = x;
      by = y;
      bw = width;
      bh = height - (borders[2].width);

      switch(borderSide) {
        case 0:
          // top border
          bh = borders[0].width;

          borderArgs = drawSide({
            c1: [bx, by],
            c2: [bx + bw, by],
            c3: [bx + bw - borders[1].width, by + bh],
            c4: [bx + borders[3].width, by + bh]
          }, borderRadius[0], borderRadius[1],
          borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
          break;
        case 1:
          // right border
          bx = x + width - (borders[1].width);
          bw = borders[1].width;

          borderArgs = drawSide({
            c1: [bx + bw, by],
            c2: [bx + bw, by + bh + borders[2].width],
            c3: [bx, by + bh],
            c4: [bx, by + borders[0].width]
          }, borderRadius[1], borderRadius[2],
          borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
          break;
        case 2:
          // bottom border
          by = (by + height) - (borders[2].width);
          bh = borders[2].width;

          borderArgs = drawSide({
            c1: [bx + bw, by + bh],
            c2: [bx, by + bh],
            c3: [bx + borders[3].width, by],
            c4: [bx + bw - borders[2].width, by]
          }, borderRadius[2], borderRadius[3],
          borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
          break;
        case 3:
          // left border
          bw = borders[3].width;

          borderArgs = drawSide({
            c1: [bx, by + bh + borders[2].width],
            c2: [bx, by],
            c3: [bx + bw, by + borders[0].width],
            c4: [bx + bw, by + bh]
          }, borderRadius[3], borderRadius[0],
          borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
          break;
      }

      borderData.borders.push({
        args: borderArgs,
        color: borders[borderSide].color
      });

    }
  }

  return borderData;
}

function createShape(ctx, args) {
  var shape = ctx.drawShape();
  args.forEach(function(border, index) {
    shape[(index === 0) ? "moveTo" : border[0] + "To" ].apply(null, border.slice(1));
  });
  return shape;
}

function renderBorders(ctx, borderArgs, color) {
  if (color !== "transparent") {
    ctx.setVariable( "fillStyle", color);
    createShape(ctx, borderArgs);
    ctx.fill();
    numDraws+=1;
  }
}

function renderFormValue (el, bounds, stack){

  var valueWrap = doc.createElement('valuewrap'),
  cssPropertyArray = ['lineHeight','textAlign','fontFamily','color','fontSize','paddingLeft','paddingTop','width','height','border','borderLeftWidth','borderTopWidth'],
  textValue,
  textNode;

  cssPropertyArray.forEach(function(property) {
    try {
      valueWrap.style[property] = getCSS(el, property);
    } catch(e) {
      // Older IE has issues with "border"
      h2clog("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
    }
  });

  valueWrap.style.borderColor = "black";
  valueWrap.style.borderStyle = "solid";
  valueWrap.style.display = "block";
  valueWrap.style.position = "absolute";

  if (/^(submit|reset|button|text|password)$/.test(el.type) || el.nodeName === "SELECT"){
    valueWrap.style.lineHeight = getCSS(el, "height");
  }

  valueWrap.style.top = bounds.top + "px";
  valueWrap.style.left = bounds.left + "px";

  textValue = (el.nodeName === "SELECT") ? (el.options[el.selectedIndex] || 0).text : el.value;
  if(!textValue) {
    textValue = el.placeholder;
  }

  textNode = doc.createTextNode(textValue);

  valueWrap.appendChild(textNode);
  body.appendChild(valueWrap);

  renderText(el, textNode, stack);
  body.removeChild(valueWrap);
}

function drawImage (ctx) {
  ctx.drawImage.apply(ctx, Array.prototype.slice.call(arguments, 1));
  numDraws+=1;
}

function getPseudoElement(el, which) {
  var elStyle = window.getComputedStyle(el, which);
  if(!elStyle || !elStyle.content || elStyle.content === "none" || elStyle.content === "-moz-alt-content") {
    return;
  }
  var content = elStyle.content + '',
  first = content.substr( 0, 1 );
  //strips quotes
  if(first === content.substr( content.length - 1 ) && first.match(/'|"/)) {
    content = content.substr( 1, content.length - 2 );
  }

  var isImage = content.substr( 0, 3 ) === 'url',
  elps = document.createElement( isImage ? 'img' : 'span' );

  elps.className = pseudoHide + "-before " + pseudoHide + "-after";

  Object.keys(elStyle).filter(indexedProperty).forEach(function(prop) {
    // Prevent assigning of read only CSS Rules, ex. length, parentRule
    try {
      elps.style[prop] = elStyle[prop];
    } catch (e) {
      h2clog(['Tried to assign readonly property ', prop, 'Error:', e]);
    }
  });

  if(isImage) {
    elps.src = _html2canvas.Util.parseBackgroundImage(content)[0].args[0];
  } else {
    elps.innerHTML = content;
  }
  return elps;
}

function indexedProperty(property) {
  return (isNaN(window.parseInt(property, 10)));
}

function injectPseudoElements(el, stack) {
  var before = getPseudoElement(el, ':before'),
  after = getPseudoElement(el, ':after');
  if(!before && !after) {
    return;
  }

  if(before) {
    el.className += " " + pseudoHide + "-before";
    el.parentNode.insertBefore(before, el);
    parseElement(before, stack, true);
    el.parentNode.removeChild(before);
    el.className = el.className.replace(pseudoHide + "-before", "").trim();
  }

  if (after) {
    el.className += " " + pseudoHide + "-after";
    el.appendChild(after);
    parseElement(after, stack, true);
    el.removeChild(after);
    el.className = el.className.replace(pseudoHide + "-after", "").trim();
  }

}

function renderBackgroundRepeat(ctx, image, backgroundPosition, bounds) {
  var offsetX = Math.round(bounds.left + backgroundPosition.left),
  offsetY = Math.round(bounds.top + backgroundPosition.top);

  ctx.createPattern(image);
  ctx.translate(offsetX, offsetY);
  ctx.fill();
  ctx.translate(-offsetX, -offsetY);
}

function backgroundRepeatShape(ctx, image, backgroundPosition, bounds, left, top, width, height) {
  var args = [];
  args.push(["line", Math.round(left), Math.round(top)]);
  args.push(["line", Math.round(left + width), Math.round(top)]);
  args.push(["line", Math.round(left + width), Math.round(height + top)]);
  args.push(["line", Math.round(left), Math.round(height + top)]);
  createShape(ctx, args);
  ctx.save();
  ctx.clip();
  renderBackgroundRepeat(ctx, image, backgroundPosition, bounds);
  ctx.restore();
}

function renderBackgroundColor(ctx, backgroundBounds, bgcolor) {
  renderRect(
    ctx,
    backgroundBounds.left,
    backgroundBounds.top,
    backgroundBounds.width,
    backgroundBounds.height,
    bgcolor
    );
}

function renderBackgroundRepeating(el, bounds, ctx, image, imageIndex) {
  var backgroundSize = _html2canvas.Util.BackgroundSize(el, bounds, image, imageIndex),
  backgroundPosition = _html2canvas.Util.BackgroundPosition(el, bounds, image, imageIndex, backgroundSize),
  backgroundRepeat = getCSS(el, "backgroundRepeat").split(",").map(function(value) {
    return value.trim();
  });

  image = resizeImage(image, backgroundSize);

  backgroundRepeat = backgroundRepeat[imageIndex] || backgroundRepeat[0];

  switch (backgroundRepeat) {
    case "repeat-x":
      backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
        bounds.left, bounds.top + backgroundPosition.top, 99999, image.height);
      break;

    case "repeat-y":
      backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
        bounds.left + backgroundPosition.left, bounds.top, image.width, 99999);
      break;

    case "no-repeat":
      backgroundRepeatShape(ctx, image, backgroundPosition, bounds,
        bounds.left + backgroundPosition.left, bounds.top + backgroundPosition.top, image.width, image.height);
      break;

    default:
      renderBackgroundRepeat(ctx, image, backgroundPosition, {
        top: bounds.top,
        left: bounds.left,
        width: image.width,
        height: image.height
      });
      break;
  }
}

function renderBackgroundImage(element, bounds, ctx) {
  var backgroundImage = getCSS(element, "backgroundImage"),
  backgroundImages = _html2canvas.Util.parseBackgroundImage(backgroundImage),
  image,
  imageIndex = backgroundImages.length;

  while(imageIndex--) {
    backgroundImage = backgroundImages[imageIndex];

    if (!backgroundImage.args || backgroundImage.args.length === 0) {
      continue;
    }

    var key = backgroundImage.method === 'url' ?
    backgroundImage.args[0] :
    backgroundImage.value;

    image = loadImage(key);

    // TODO add support for background-origin
    if (image) {
      renderBackgroundRepeating(element, bounds, ctx, image, imageIndex);
    } else {
      h2clog("html2canvas: Error loading background:", backgroundImage);
    }
  }
}

function resizeImage(image, bounds) {
  if(image.width === bounds.width && image.height === bounds.height) {
    return image;
  }

  var ctx, canvas = doc.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  ctx = canvas.getContext("2d");
  drawImage(ctx, image, 0, 0, image.width, image.height, 0, 0, bounds.width, bounds.height );
  return canvas;
}

function setOpacity(ctx, element, parentStack) {
  var opacity = getCSS(element, "opacity") * ((parentStack) ? parentStack.opacity : 1);
  ctx.setVariable("globalAlpha", opacity);
  return opacity;
}

function createStack(element, parentStack, bounds) {

  var ctx = h2cRenderContext((!parentStack) ? documentWidth() : bounds.width , (!parentStack) ? documentHeight() : bounds.height),
  stack = {
    ctx: ctx,
    zIndex: setZ(getCSS(element, "zIndex"), (parentStack) ? parentStack.zIndex : null),
    opacity: setOpacity(ctx, element, parentStack),
    cssPosition: getCSS(element, "position"),
    borders: getBorderData(element),
    clip: (parentStack && parentStack.clip) ? _html2canvas.Util.Extend( {}, parentStack.clip ) : null
  };

  // TODO correct overflow for absolute content residing under a static position
  if (options.useOverflow === true && /(hidden|scroll|auto)/.test(getCSS(element, "overflow")) === true && /(BODY)/i.test(element.nodeName) === false){
    stack.clip = (stack.clip) ? clipBounds(stack.clip, bounds) : bounds;
  }

  stack.zIndex.children.push(stack);

  return stack;
}

function getBackgroundBounds(borders, bounds, clip) {
  var backgroundBounds = {
    left: bounds.left + borders[3].width,
    top: bounds.top + borders[0].width,
    width: bounds.width - (borders[1].width + borders[3].width),
    height: bounds.height - (borders[0].width + borders[2].width)
  };

  if (clip) {
    backgroundBounds = clipBounds(backgroundBounds, clip);
  }

  return backgroundBounds;
}

function renderElement(element, parentStack, pseudoElement){
  var bounds = _html2canvas.Util.Bounds(element),
  image,
  bgcolor = (ignoreElementsRegExp.test(element.nodeName)) ? "#efefef" : getCSS(element, "backgroundColor"),
  stack = createStack(element, parentStack, bounds),
  borders = stack.borders,
  ctx = stack.ctx,
  backgroundBounds = getBackgroundBounds(borders, bounds, stack.clip),
  borderData = parseBorders(element, bounds, borders);

  createShape(ctx, borderData.clip);

  ctx.save();
  ctx.clip();

  if (backgroundBounds.height > 0 && backgroundBounds.width > 0){
    renderBackgroundColor(ctx, bounds, bgcolor);
    renderBackgroundImage(element, backgroundBounds, ctx);
  }

  ctx.restore();

  borderData.borders.forEach(function(border) {
    renderBorders(ctx, border.args, border.color);
  });

  if (!pseudoElement) {
    injectPseudoElements(element, stack);
  }

  switch(element.nodeName){
    case "IMG":
      if ((image = loadImage(element.getAttribute('src')))) {
        renderImage(ctx, element, image, bounds, borders);
      } else {
        h2clog("html2canvas: Error loading <img>:" + element.getAttribute('src'));
      }
      break;
    case "INPUT":
      // TODO add all relevant type's, i.e. HTML5 new stuff
      // todo add support for placeholder attribute for browsers which support it
      if (/^(text|url|email|submit|button|reset)$/.test(element.type) && (element.value || element.placeholder).length > 0){
        renderFormValue(element, bounds, stack);
      }
      break;
    case "TEXTAREA":
      if ((element.value || element.placeholder || "").length > 0){
        renderFormValue(element, bounds, stack);
      }
      break;
    case "SELECT":
      if ((element.options||element.placeholder || "").length > 0){
        renderFormValue(element, bounds, stack);
      }
      break;
    case "LI":
      renderListItem(element, stack, backgroundBounds);
      break;
    case "CANVAS":
      renderImage(ctx, element, element, bounds, borders);
      break;
  }

  return stack;
}

function isElementVisible(element) {
  return (getCSS(element, 'display') !== "none" && getCSS(element, 'visibility') !== "hidden" && !element.hasAttribute("data-html2canvas-ignore"));
}

function parseElement (el, stack, pseudoElement) {

  if (isElementVisible(el)) {
    stack = renderElement(el, stack, pseudoElement) || stack;
    if (!ignoreElementsRegExp.test(el.nodeName)) {
      _html2canvas.Util.Children(el).forEach(function(node) {
        if (node.nodeType === 1) {
          parseElement(node, stack, pseudoElement);
        } else if (node.nodeType === 3) {
          renderText(el, node, stack);
        }
      });
    }
  }
}

function svgDOMRender(body, stack) {
  var img = new Image(),
  docWidth = documentWidth(),
  docHeight = documentHeight(),
  html = "";

  function parseDOM(el) {
    var children = _html2canvas.Util.Children( el ),
    len = children.length,
    attr,
    a,
    alen,
    elm,
    i;
    for ( i = 0; i < len; i+=1 ) {
      elm = children[ i ];
      if ( elm.nodeType === 3 ) {
        // Text node
        html += elm.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;");
      } else if ( elm.nodeType === 1 ) {
        // Element
        if ( !/^(script|meta|title)$/.test(elm.nodeName.toLowerCase()) ) {

          html += "<" + elm.nodeName.toLowerCase();

          // add attributes
          if ( elm.hasAttributes() ) {
            attr = elm.attributes;
            alen = attr.length;
            for ( a = 0; a < alen; a+=1 ) {
              html += " " + attr[ a ].name + '="' + attr[ a ].value + '"';
            }
          }


          html += '>';

          parseDOM( elm );


          html += "</" + elm.nodeName.toLowerCase() + ">";
        }
      }

    }

  }

  parseDOM(body);
  img.src = [
  "data:image/svg+xml,",
  "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='" + docWidth + "' height='" + docHeight + "'>",
  "<foreignObject width='" + docWidth + "' height='" + docHeight + "'>",
  "<html xmlns='http://www.w3.org/1999/xhtml' style='margin:0;'>",
  html.replace(/\#/g,"%23"),
  "</html>",
  "</foreignObject>",
  "</svg>"
  ].join("");

  img.onload = function() {
    stack.svgRender = img;
  };

}

function init() {
  var stack = renderElement(element, null);

  if (support.svgRendering) {
    svgDOMRender(document.documentElement, stack);
  }

  Array.prototype.slice.call(element.children, 0).forEach(function(childElement) {
    parseElement(childElement, stack);
  });

  stack.backgroundColor = getCSS(document.documentElement, "backgroundColor");
  body.removeChild(hidePseudoElements);
  return stack;
}

return init();
};

function h2czContext(zindex) {
return {
  zindex: zindex,
  children: []
};
}
_html2canvas.Preload = function( options ) {

var images = {
  numLoaded: 0,   // also failed are counted here
  numFailed: 0,
  numTotal: 0,
  cleanupDone: false
},
pageOrigin,
methods,
i,
count = 0,
element = options.elements[0] || document.body,
doc = element.ownerDocument,
domImages = doc.images, // TODO probably should limit it to images present in the element only
imgLen = domImages.length,
link = doc.createElement("a"),
supportCORS = (function( img ){
  return (img.crossOrigin !== undefined);
})(new Image()),
timeoutTimer;

link.href = window.location.href;
pageOrigin  = link.protocol + link.host;

function isSameOrigin(url){
  link.href = url;
  link.href = link.href; // YES, BELIEVE IT OR NOT, that is required for IE9 - http://jsfiddle.net/niklasvh/2e48b/
  var origin = link.protocol + link.host;
  return (origin === pageOrigin);
}

function start(){
  h2clog("html2canvas: start: images: " + images.numLoaded + " / " + images.numTotal + " (failed: " + images.numFailed + ")");
  if (!images.firstRun && images.numLoaded >= images.numTotal){
    h2clog("Finished loading images: # " + images.numTotal + " (failed: " + images.numFailed + ")");

    if (typeof options.complete === "function"){
      options.complete(images);
    }

  }
}

// TODO modify proxy to serve images with CORS enabled, where available
function proxyGetImage(url, img, imageObj){
  var callback_name,
  scriptUrl = options.proxy,
  script;

  link.href = url;
  url = link.href; // work around for pages with base href="" set - WARNING: this may change the url

  callback_name = 'html2canvas_' + (count++);
  imageObj.callbackname = callback_name;

  if (scriptUrl.indexOf("?") > -1) {
    scriptUrl += "&";
  } else {
    scriptUrl += "?";
  }
  scriptUrl += 'url=' + encodeURIComponent(url) + '&callback=' + callback_name;
  script = doc.createElement("script");

  window[callback_name] = function(a){
    if (a.substring(0,6) === "error:"){
      imageObj.succeeded = false;
      images.numLoaded++;
      images.numFailed++;
      start();
    } else {
      setImageLoadHandlers(img, imageObj);
      img.src = a;
    }
    window[callback_name] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
    try {
      delete window[callback_name];  // for all browser that support this
    } catch(ex) {}
    script.parentNode.removeChild(script);
    script = null;
    delete imageObj.script;
    delete imageObj.callbackname;
  };

  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", scriptUrl);
  imageObj.script = script;
  window.document.body.appendChild(script);

}

function loadPseudoElement(element, type) {
  var style = window.getComputedStyle(element, type),
  content = style.content;
  if (content.substr(0, 3) === 'url') {
    methods.loadImage(_html2canvas.Util.parseBackgroundImage(content)[0].args[0]);
  }
  loadBackgroundImages(style.backgroundImage, element);
}

function loadPseudoElementImages(element) {
  loadPseudoElement(element, ":before");
  loadPseudoElement(element, ":after");
}

function loadGradientImage(backgroundImage, bounds) {
  var img = _html2canvas.Generate.Gradient(backgroundImage, bounds);

  if (img !== undefined){
    images[backgroundImage] = {
      img: img,
      succeeded: true
    };
    images.numTotal++;
    images.numLoaded++;
    start();
  }
}

function invalidBackgrounds(background_image) {
  return (background_image && background_image.method && background_image.args && background_image.args.length > 0 );
}

function loadBackgroundImages(background_image, el) {
  var bounds;

  _html2canvas.Util.parseBackgroundImage(background_image).filter(invalidBackgrounds).forEach(function(background_image) {
    if (background_image.method === 'url') {
      methods.loadImage(background_image.args[0]);
    } else if(background_image.method.match(/\-?gradient$/)) {
      if(bounds === undefined) {
        bounds = _html2canvas.Util.Bounds(el);
      }
      loadGradientImage(background_image.value, bounds);
    }
  });
}

function getImages (el) {
  var elNodeType = false;

  // Firefox fails with permission denied on pages with iframes
  try {
    _html2canvas.Util.Children(el).forEach(function(img) {
      getImages(img);
    });
  }
  catch( e ) {}

  try {
    elNodeType = el.nodeType;
  } catch (ex) {
    elNodeType = false;
    h2clog("html2canvas: failed to access some element's nodeType - Exception: " + ex.message);
  }

  if (elNodeType === 1 || elNodeType === undefined) {
    loadPseudoElementImages(el);
    try {
      loadBackgroundImages(_html2canvas.Util.getCSS(el, 'backgroundImage'), el);
    } catch(e) {
      h2clog("html2canvas: failed to get background-image - Exception: " + e.message);
    }
    loadBackgroundImages(el);
  }
}

function setImageLoadHandlers(img, imageObj) {
  img.onload = function() {
    if ( imageObj.timer !== undefined ) {
      // CORS succeeded
      window.clearTimeout( imageObj.timer );
    }

    images.numLoaded++;
    imageObj.succeeded = true;
    img.onerror = img.onload = null;
    start();
  };
  img.onerror = function() {
    if (img.crossOrigin === "anonymous") {
      // CORS failed
      window.clearTimeout( imageObj.timer );

      // let's try with proxy instead
      if ( options.proxy ) {
        var src = img.src;
        img = new Image();
        imageObj.img = img;
        img.src = src;

        proxyGetImage( img.src, img, imageObj );
        return;
      }
    }

    images.numLoaded++;
    images.numFailed++;
    imageObj.succeeded = false;
    img.onerror = img.onload = null;
    start();
  };
}

methods = {
  loadImage: function( src ) {
    var img, imageObj;
    if ( src && images[src] === undefined ) {
      img = new Image();
      if ( src.match(/data:image\/.*;base64,/i) ) {
        img.src = src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, '');
        imageObj = images[src] = {
          img: img
        };
        images.numTotal++;
        setImageLoadHandlers(img, imageObj);
      } else if ( isSameOrigin( src ) || options.allowTaint ===  true ) {
        imageObj = images[src] = {
          img: img
        };
        images.numTotal++;
        setImageLoadHandlers(img, imageObj);
        img.src = src;
      } else if ( supportCORS && !options.allowTaint && options.useCORS ) {
        // attempt to load with CORS

        img.crossOrigin = "anonymous";
        imageObj = images[src] = {
          img: img
        };
        images.numTotal++;
        setImageLoadHandlers(img, imageObj);
        img.src = src;

        // work around for https://bugs.webkit.org/show_bug.cgi?id=80028
        img.customComplete = function () {
          if (!this.img.complete) {
            this.timer = window.setTimeout(this.img.customComplete, 100);
          } else {
            this.img.onerror();
          }
        }.bind(imageObj);
        img.customComplete();

      } else if ( options.proxy ) {
        imageObj = images[src] = {
          img: img
        };
        images.numTotal++;
        proxyGetImage( src, img, imageObj );
      }
    }

  },
  cleanupDOM: function(cause) {
    var img, src;
    if (!images.cleanupDone) {
      if (cause && typeof cause === "string") {
        h2clog("html2canvas: Cleanup because: " + cause);
      } else {
        h2clog("html2canvas: Cleanup after timeout: " + options.timeout + " ms.");
      }

      for (src in images) {
        if (images.hasOwnProperty(src)) {
          img = images[src];
          if (typeof img === "object" && img.callbackname && img.succeeded === undefined) {
            // cancel proxy image request
            window[img.callbackname] = undefined; // to work with IE<9  // NOTE: that the undefined callback property-name still exists on the window object (for IE<9)
            try {
              delete window[img.callbackname];  // for all browser that support this
            } catch(ex) {}
            if (img.script && img.script.parentNode) {
              img.script.setAttribute("src", "about:blank");  // try to cancel running request
              img.script.parentNode.removeChild(img.script);
            }
            images.numLoaded++;
            images.numFailed++;
            h2clog("html2canvas: Cleaned up failed img: '" + src + "' Steps: " + images.numLoaded + " / " + images.numTotal);
          }
        }
      }

      // cancel any pending requests
      if(window.stop !== undefined) {
        window.stop();
      } else if(document.execCommand !== undefined) {
        document.execCommand("Stop", false);
      }
      if (document.close !== undefined) {
        document.close();
      }
      images.cleanupDone = true;
      if (!(cause && typeof cause === "string")) {
        start();
      }
    }
  },

  renderingDone: function() {
    if (timeoutTimer) {
      window.clearTimeout(timeoutTimer);
    }
  }
};

if (options.timeout > 0) {
  timeoutTimer = window.setTimeout(methods.cleanupDOM, options.timeout);
}

h2clog('html2canvas: Preload starts: finding background-images');
images.firstRun = true;

getImages(element);

h2clog('html2canvas: Preload: Finding images');
// load <img> images
for (i = 0; i < imgLen; i+=1){
  methods.loadImage( domImages[i].getAttribute( "src" ) );
}

images.firstRun = false;
h2clog('html2canvas: Preload: Done.');
if ( images.numTotal === images.numLoaded ) {
  start();
}

return methods;

};
_html2canvas.Renderer = function(parseQueue, options){

function createRenderQueue(parseQueue) {
  var queue = [];

  var sortZ = function(zStack){
    var subStacks = [],
    stackValues = [];

    zStack.children.forEach(function(stackChild) {
      if (stackChild.children && stackChild.children.length > 0){
        subStacks.push(stackChild);
        stackValues.push(stackChild.zindex);
      } else {
        queue.push(stackChild);
      }
    });

    stackValues.sort(function(a, b) {
      return a - b;
    });

    stackValues.forEach(function(zValue) {
      var index;

      subStacks.some(function(stack, i){
        index = i;
        return (stack.zindex === zValue);
      });
      sortZ(subStacks.splice(index, 1)[0]);

    });
  };

  sortZ(parseQueue.zIndex);

  return queue;
}

function getRenderer(rendererName) {
  var renderer;

  if (typeof options.renderer === "string" && _html2canvas.Renderer[rendererName] !== undefined) {
    renderer = _html2canvas.Renderer[rendererName](options);
  } else if (typeof rendererName === "function") {
    renderer = rendererName(options);
  } else {
    throw new Error("Unknown renderer");
  }

  if ( typeof renderer !== "function" ) {
    throw new Error("Invalid renderer defined");
  }
  return renderer;
}

return getRenderer(options.renderer)(parseQueue, options, document, createRenderQueue(parseQueue), _html2canvas);
};

_html2canvas.Util.Support = function (options, doc) {

function supportSVGRendering() {
  var img = new Image(),
  canvas = doc.createElement("canvas"),
  ctx = (canvas.getContext === undefined) ? false : canvas.getContext("2d");
  if (ctx === false) {
    return false;
  }
  canvas.width = canvas.height = 10;
  img.src = [
  "data:image/svg+xml,",
  "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>",
  "<foreignObject width='10' height='10'>",
  "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>",
  "sup",
  "</div>",
  "</foreignObject>",
  "</svg>"
  ].join("");
  try {
    ctx.drawImage(img, 0, 0);
    canvas.toDataURL();
  } catch(e) {
    return false;
  }
  h2clog('html2canvas: Parse: SVG powered rendering available');
  return true;
}

// Test whether we can use ranges to measure bounding boxes
// Opera doesn't provide valid bounds.height/bottom even though it supports the method.

function supportRangeBounds() {
  var r, testElement, rangeBounds, rangeHeight, support = false;

  if (doc.createRange) {
    r = doc.createRange();
    if (r.getBoundingClientRect) {
      testElement = doc.createElement('boundtest');
      testElement.style.height = "123px";
      testElement.style.display = "block";
      doc.body.appendChild(testElement);

      r.selectNode(testElement);
      rangeBounds = r.getBoundingClientRect();
      rangeHeight = rangeBounds.height;

      if (rangeHeight === 123) {
        support = true;
      }
      doc.body.removeChild(testElement);
    }
  }

  return support;
}

return {
  rangeBounds: supportRangeBounds(),
  svgRendering: options.svgRendering && supportSVGRendering()
};
};
window.html2canvas = function(elements, opts) {
elements = (elements.length) ? elements : [elements];
var queue,
canvas,
options = {
  // general
  logging: false,
  elements: elements,
  background: "#fff",

  // preload options
  proxy: null,
  timeout: 0,    // no timeout
  useCORS: false, // try to load images as CORS (where available), before falling back to proxy
  allowTaint: false, // whether to allow images to taint the canvas, won't need proxy if set to true

  // parse options
  svgRendering: false, // use svg powered rendering where available (FF11+)
  ignoreElements: "IFRAME|OBJECT|PARAM",
  useOverflow: true,
  letterRendering: false,
  chinese: false,

  // render options

  width: null,
  height: null,
  taintTest: true, // do a taint test with all images before applying to canvas
  renderer: "Canvas"
};

options = _html2canvas.Util.Extend(opts, options);

_html2canvas.logging = options.logging;
options.complete = function( images ) {

  if (typeof options.onpreloaded === "function") {
    if ( options.onpreloaded( images ) === false ) {
      return;
    }
  }
  queue = _html2canvas.Parse( images, options );

  if (typeof options.onparsed === "function") {
    if ( options.onparsed( queue ) === false ) {
      return;
    }
  }

  canvas = _html2canvas.Renderer( queue, options );

  if (typeof options.onrendered === "function") {
    options.onrendered( canvas );
  }


};

// for pages without images, we still want this to be async, i.e. return methods before executing
window.setTimeout( function(){
  _html2canvas.Preload( options );
}, 0 );

return {
  render: function( queue, opts ) {
    return _html2canvas.Renderer( queue, _html2canvas.Util.Extend(opts, options) );
  },
  parse: function( images, opts ) {
    return _html2canvas.Parse( images, _html2canvas.Util.Extend(opts, options) );
  },
  preload: function( opts ) {
    return _html2canvas.Preload( _html2canvas.Util.Extend(opts, options) );
  },
  log: h2clog
};
};

window.html2canvas.log = h2clog; // for renderers
window.html2canvas.Renderer = {
Canvas: undefined // We are assuming this will be used
};
_html2canvas.Renderer.Canvas = function(options) {

options = options || {};

var doc = document,
safeImages = [],
testCanvas = document.createElement("canvas"),
testctx = testCanvas.getContext("2d"),
canvas = options.canvas || doc.createElement('canvas');


function createShape(ctx, args) {
  ctx.beginPath();
  args.forEach(function(arg) {
    ctx[arg.name].apply(ctx, arg['arguments']);
  });
  ctx.closePath();
}

function safeImage(item) {
  if (safeImages.indexOf(item['arguments'][0].src ) === -1) {
    testctx.drawImage(item['arguments'][0], 0, 0);
    try {
      testctx.getImageData(0, 0, 1, 1);
    } catch(e) {
      testCanvas = doc.createElement("canvas");
      testctx = testCanvas.getContext("2d");
      return false;
    }
    safeImages.push(item['arguments'][0].src);
  }
  return true;
}

function isTransparent(backgroundColor) {
  return (backgroundColor === "transparent" || backgroundColor === "rgba(0, 0, 0, 0)");
}

function renderItem(ctx, item) {
  switch(item.type){
    case "variable":
      ctx[item.name] = item['arguments'];
      break;
    case "function":
      if (item.name === "createPattern") {
        if (item['arguments'][0].width > 0 && item['arguments'][0].height > 0) {
          try {
            ctx.fillStyle = ctx.createPattern(item['arguments'][0], "repeat");
          }
          catch(e) {
            h2clog("html2canvas: Renderer: Error creating pattern", e.message);
          }
        }
      } else if (item.name === "drawShape") {
        createShape(ctx, item['arguments']);
      } else if (item.name === "drawImage") {
        if (item['arguments'][8] > 0 && item['arguments'][7] > 0) {
          if (!options.taintTest || (options.taintTest && safeImage(item))) {
            ctx.drawImage.apply( ctx, item['arguments'] );
          }
        }
      } else {
        ctx[item.name].apply(ctx, item['arguments']);
      }
      break;
  }
}

return function(zStack, options, doc, queue, _html2canvas) {

  var ctx = canvas.getContext("2d"),
  storageContext,
  i,
  queueLen,
  newCanvas,
  bounds,
  fstyle;

  canvas.width = canvas.style.width =  options.width || zStack.ctx.width;
  canvas.height = canvas.style.height = options.height || zStack.ctx.height;

  fstyle = ctx.fillStyle;
  ctx.fillStyle = (isTransparent(zStack.backgroundColor) && options.background !== undefined) ? options.background : zStack.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fstyle;


  if ( options.svgRendering && zStack.svgRender !== undefined ) {
    // TODO: enable async rendering to support this
    ctx.drawImage( zStack.svgRender, 0, 0 );
  } else {
    for ( i = 0, queueLen = queue.length; i < queueLen; i+=1 ) {
      storageContext = queue.splice(0, 1)[0];
      storageContext.canvasPosition = storageContext.canvasPosition || {};

      // set common settings for canvas
      ctx.textBaseline = "bottom";

      if (storageContext.clip){
        ctx.save();
        ctx.beginPath();
        // console.log(storageContext);
        ctx.rect(storageContext.clip.left, storageContext.clip.top, storageContext.clip.width, storageContext.clip.height);
        ctx.clip();
      }

      if (storageContext.ctx.storage) {
        storageContext.ctx.storage.forEach(renderItem.bind(null, ctx));
      }

      if (storageContext.clip){
        ctx.restore();
      }
    }
  }

  h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");

  queueLen = options.elements.length;

  if (queueLen === 1) {
    if (typeof options.elements[0] === "object" && options.elements[0].nodeName !== "BODY") {
      // crop image to the bounds of selected (single) element
      bounds = _html2canvas.Util.Bounds(options.elements[0]);
      newCanvas = doc.createElement('canvas');
      newCanvas.width = bounds.width;
      newCanvas.height = bounds.height;
      ctx = newCanvas.getContext("2d");

      ctx.drawImage(canvas, bounds.left, bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
      canvas = null;
      return newCanvas;
    }
  }

  return canvas;
};
};
})(window,document);