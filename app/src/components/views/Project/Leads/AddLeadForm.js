import React from 'react';
import axios from 'axios';
import { Row, Col, Form, Input, Modal } from 'antd';

class NamesField extends React.Component {
  render() {
    return (
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Фамилия" className="app-form-field">
            {this.props.getFieldDecorator('last_name', {
              rules: [ { required: true, message: 'Заполните это поле.' } ],
            })(
              <Input autofocus="true" />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Имя" className="app-form-field">
            {this.props.getFieldDecorator('first_name', {
              rules: [ { required: true, message: 'Заполните это поле.' } ],
            })(
              <Input autofocus="true" />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Отчество" className="app-form-field">
            {this.props.getFieldDecorator('patronymic', {
              rules: [ { required: true, message: 'Заполните это поле.' } ],
            })(
              <Input autofocus="true" />
            )}
          </Form.Item>
        </Col>
      </Row>
    )
  }
}

class AddLeadForm extends React.Component {
  render() {
    const {
      visible, onCancel, addLead, form
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        width={600}
        visible={visible}
        title={(<b>Добавить лид</b>)}
        okText="Добавить"
        cancelText="Отмена"
        onOk={addLead}
        onCancel={onCancel} >
        <Form hideRequiredMark="false" className="app-form" layout="vertical">
          <div className="app-form-fields">
            <NamesField getFieldDecorator={getFieldDecorator} />
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'add_lead' })(AddLeadForm);