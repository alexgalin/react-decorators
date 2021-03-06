import cssModules from '../css-modules';
import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import React from 'react';

describe('@cssModules', () => {

    const styles = {
        'div-class':   'div-class-name',
        'code-class':  'code-class-name',
        'spanClass':   'span-class-name',
        'ignoreClass': 'should-not-appear'
    };

    const PropsComponent = props => (
        <div className="spanClass">
            {props.child}
        </div>
    );

    @cssModules(styles)
    class TestComponent extends React.Component {

        render() {
            const { divClass, spanClass, codeClass, children } = this.props;
            // const PropsComponent = props => props.child;
            return (
                <div className={divClass}>
                    <span className={spanClass} />
                    <PropsComponent child={<code className={codeClass} />} />
                    <code>{children}</code>
                </div>
            );
        }

    }

    const el = shallow(
        <TestComponent
            divClass="div-class"
            codeClass="code-class"
            spanClass={[{spanClass: true, ignoreClass: false}, 'extra-class']}>
            Child
        </TestComponent>
    );

    it('validate `children` is not being lost', () => {
        expect(el.find('code').text()).to.equal('Child');
    });

    it('transforms a string className', () => {
        expect(el.find('div').props().className).to.equal('div-class-name');
    });

    it('transforms a nested object/array className', () => {
        expect(el.find('span').props().className).to.include('span-class-name');
        expect(el.find('span').props().className).to.include('extra-class');
        expect(el.find('span').props().className).to.not.include('spanClass');
        expect(el.find('span').props().className).to.not.include('ignoreClass');
        expect(el.find('span').props().className).to.not.include('should-not-appear');
    });

    it('transforms a property element className', () => {
        expect(el
            .find('PropsComponent').shallow()
            .find('code').props().className
        ).to.include('code-class-name');
    });

});
