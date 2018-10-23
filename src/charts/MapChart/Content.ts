import { MapOpts } from './interface';
export default class {

    props: MapOpts = null;
    BUILDER = null;
    PROJECTION = null;

    constructor(builder, projection, props: MapOpts) {
        this.BUILDER = builder;
        this.PROJECTION = projection;
        this.props = props;
    }


    reset(builder, projection,group){
        this.BUILDER = builder;
        this.PROJECTION = projection;
        this.resize(group);
    }

    resize(group) {

    }

    setData(group, data?) {

    }


    append(enter) {

    }

    update(group) {

    }


}