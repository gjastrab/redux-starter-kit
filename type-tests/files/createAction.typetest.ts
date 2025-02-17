import { Action, AnyAction, ActionCreator } from 'redux'
import { createAction, PayloadAction, PayloadActionCreator } from '../../src'

function expectType<T>(p: T): T {
  return p
}

/* PayloadAction */

/*
 * Test: PayloadAction has type parameter for the payload.
 */
{
  const action: PayloadAction<number> = { type: '', payload: 5 }
  const numberPayload: number = action.payload

  // typings:expect-error
  const stringPayload: string = action.payload
}

/*
 * Test: PayloadAction type parameter is required.
 */
{
  // typings:expect-error
  const action: PayloadAction = { type: '', payload: 5 }
  // typings:expect-error
  const numberPayload: number = action.payload
  // typings:expect-error
  const stringPayload: string = action.payload
}

/*
 * Test: PayloadAction has a string type tag.
 */
{
  const action: PayloadAction<number> = { type: '', payload: 5 }

  // typings:expect-error
  const action2: PayloadAction = { type: 1, payload: 5 }
}

/*
 * Test: PayloadAction is compatible with Action<string>
 */
{
  const action: PayloadAction<number> = { type: '', payload: 5 }
  const stringAction: Action<string> = action
}

/* PayloadActionCreator */

/*
 * Test: PayloadActionCreator returns correctly typed PayloadAction depending
 * on whether a payload is passed.
 */
{
  const actionCreator = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload
    }),
    { type: 'action' }
  ) as PayloadActionCreator<number | undefined>

  expectType<PayloadAction<number>>(actionCreator(1))
  expectType<PayloadAction<undefined>>(actionCreator())
  expectType<PayloadAction<undefined>>(actionCreator(undefined))

  // typings:expect-error
  expectType<PayloadAction<number>>(actionCreator())
  // typings:expect-error
  expectType<PayloadAction<undefined>>(actionCreator(1))
}

/*
 * Test: PayloadActionCreator is compatible with ActionCreator.
 */
{
  const payloadActionCreator = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload
    }),
    { type: 'action' }
  ) as PayloadActionCreator
  const actionCreator: ActionCreator<AnyAction> = payloadActionCreator

  const payloadActionCreator2 = Object.assign(
    (payload?: number) => ({
      type: 'action',
      payload: payload || 1
    }),
    { type: 'action' }
  ) as PayloadActionCreator<number>

  const actionCreator2: ActionCreator<
    PayloadAction<number>
  > = payloadActionCreator2
}

/* createAction() */

/*
 * Test: createAction() has type parameter for the action payload.
 */
{
  const increment = createAction<number, 'increment'>('increment')
  const n: number = increment(1).payload

  // typings:expect-error
  increment('').payload
}

/*
 * Test: createAction() type parameter is required, not inferred (defaults to `void`).
 */
{
  const increment = createAction('increment')
  // typings:expect-error
  const n: number = increment(1).payload
}
/*
 * Test: createAction().type is a string literal.
 */
{
  const increment = createAction<number, 'increment'>('increment')
  const n: string = increment(1).type
  const s: 'increment' = increment(1).type

  // typings:expect-error
  const r: 'other' = increment(1).type
  // typings:expect-error
  const q: number = increment(1).type
}

/*
 * Test: type still present when using prepareAction
 */
{
  const strLenAction = createAction('strLen', (payload: string) => ({
    payload: payload.length
  }))

  expectType<string>(strLenAction('test').type)
}

/*
 * Test: changing payload type with prepareAction
 */
{
  const strLenAction = createAction('strLen', (payload: string) => ({
    payload: payload.length
  }))
  expectType<number>(strLenAction('test').payload)

  // typings:expect-error
  expectType<string>(strLenAction('test').payload)
  // typings:expect-error
  const error: any = strLenAction('test').error
}

/*
 * Test: adding metadata with prepareAction
 */
{
  const strLenMetaAction = createAction('strLenMeta', (payload: string) => ({
    payload,
    meta: payload.length
  }))

  expectType<number>(strLenMetaAction('test').meta)

  // typings:expect-error
  expectType<string>(strLenMetaAction('test').meta)
  // typings:expect-error
  const error: any = strLenMetaAction('test').error
}

/*
 * Test: adding boolean error with prepareAction
 */
{
  const boolErrorAction = createAction('boolError', (payload: string) => ({
    payload,
    error: true
  }))

  expectType<boolean>(boolErrorAction('test').error)

  // typings:expect-error
  expectType<string>(boolErrorAction('test').error)
}

/*
 * Test: adding string error with prepareAction
 */
{
  const strErrorAction = createAction('strError', (payload: string) => ({
    payload,
    error: 'this is an error'
  }))

  expectType<string>(strErrorAction('test').error)

  // typings:expect-error
  expectType<boolean>(strErrorAction('test').error)
}

/*
 * regression test for https://github.com/reduxjs/redux-starter-kit/issues/214
 */
{
  const action = createAction<{ input?: string }>('ACTION')
  const t: string|undefined = action({input: ""}).payload.input;
  
  // typings:expect-error
  const u: number = action({input: ""}).payload.input;
  // typings:expect-error
  const v: number = action({input: 3}).payload.input;
}