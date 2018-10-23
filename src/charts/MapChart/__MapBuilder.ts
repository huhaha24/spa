var WIDTH, HEIGHT, CoordMap = {};
import * as d3 from 'd3';

export default class {
	left = 0;
	top = 0;
	right = 0;
	bottom = 0;

	constructor(json, width, height) {
		[WIDTH, HEIGHT] = [width, height];
		[
			[this.left, this.top],
			[this.right, this.bottom]
		] = d3.geoBounds(json);
		json.features.map(function (item) {
			CoordMap[item.properties.name] = {};
			CoordMap[item.properties.name]['id'] = item.properties.id || item.properties.adcode || item.properties.name;
			// if (item.properties.center) {
			// CoordMap[item.properties.name]['center'] = [item.properties.center.lng, item.properties.center.lat];
			// }
			// else if (item.properties.cp) {		// 旧版cp不是太准
			// 	CoordMap[item.properties.name]['center'] = item.properties.cp;
			// } 
			// else {
			CoordMap[item.properties.name]['center'] = d3.geoCentroid(item);
			// }
		});
	}

	resize(width, height) {
		[WIDTH, HEIGHT] = [width, height];
	}

	getCoord() {
		return [WIDTH, HEIGHT];
	}

	// randomPoint(cityName, size) {
	// 	var points = [];
	// 	size = size || 1;
	// 	if (CoordMap.hasOwnProperty(cityName)) {
	// 		var path = $('#area-' + CoordMap[cityName].id + ' path')[0];
	// 		var rect = path.getBBox();
	// 		for (var i = 0; i < size; i++) {
	// 			if (_.random(0, 1)) {
	// 				points.push({
	// 					x: rect.x + rect.width * 0.2 + _.random(0, rect.width * 0.6),
	// 					y: rect.y + rect.height * 0.4 + _.random(0, rect.height * 0.2),
	// 					in: cityName
	// 				});
	// 			} else {
	// 				points.push({
	// 					x: rect.x + rect.width * 0.4 + _.random(0, rect.width * 0.2),
	// 					y: rect.y + rect.height * 0.2 + _.random(0, rect.height * 0.6),
	// 					in: cityName
	// 				});
	// 			}
	// 		}
	// 	}
	// 	return points;
	// }

	getPoint(cityName) {
		if (CoordMap.hasOwnProperty(cityName)) {
			return CoordMap[cityName].center;
		}
		return null;
	}
	//获取地图中心点
	getCenter() {
		return [this.left * 0.5 + this.right * 0.5, this.bottom * 0.5 + this.top * 0.5];
	}
	//获取地图全部显示的比例
	//计算后比例大概是 1:0.017，经纬度只能转换为公里，不能对应成像素，然后使用adJUST参数进行调节
	getFullScale() {
		var hScale = (WIDTH / (this.right - this.left));
		var vScale = (HEIGHT / (this.bottom - this.top));
		return d3.min([hScale, vScale]) * 38;
	}
}