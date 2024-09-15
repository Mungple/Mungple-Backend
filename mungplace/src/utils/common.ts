import {ForwardedRef} from 'react';

// 여러 개의 ref를 병합하는 함수
function mergeRefs<T>(...refs: ForwardedRef<T>[]) {
  return (node: T) => {
    // 각 ref에 대해 노드 설정
    refs.forEach(ref => {
      // ref가 함수인 경우, 노드를 인수로 전달하여 호출
      if (typeof ref === 'function') {
        ref(node);
      // ref가 객체인 경우, current 속성에 노드 할당
      } else if (ref) {
        ref.current = node;
      }
    });
  };
}

export {mergeRefs};
