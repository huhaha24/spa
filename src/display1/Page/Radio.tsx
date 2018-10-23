import * as React from 'react';
import { Radio } from 'antd';
import { VRowProps } from './interface';
import * as _ from 'lodash';
import { RadioProps, RadioGroupContext } from 'antd/lib/radio/interface';
import RadioGroup from 'antd/lib/radio/group';
import RadioButton from 'antd/lib/radio/radioButton';

class VButton extends RadioButton{

    
}
class VGroup extends RadioGroup{

    render(){
        let param:any = _.assign({},this.props);
        if(_.has(param,'className')){
            param.className = param.className + ' vap-raido-select';
        }else{
            param.className = 'vap-raido-select';
        }
        return <RadioGroup {...param}>{this.props.children}</RadioGroup>
    }
    
}

class VRadio extends Radio{
    // static Button: typeof VButton;
    // static Group: typeof VGroup;

}
export default VRadio;