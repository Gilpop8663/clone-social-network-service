import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Form = styled.form``;

const Input = styled.input``;

export default function ToDos() {
  return (
    <Container>
      <Form>
        <Input type="text" placeholder="할 일을 적어주세요" />
        <Input type="submit" value="보내기" />
      </Form>
    </Container>
  );
}
