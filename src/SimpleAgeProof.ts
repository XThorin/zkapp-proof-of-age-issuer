import {
  state,
  State,
  method,
  PublicKey,
  Field,
  SmartContract,
} from 'snarkyjs';

export { SimpleAgeProof_ };

// here's the idea:
// if you give an age gte 18, the state will update
// and set value var to the publicKey a caller provided

class SimpleAgeProof_ extends SmartContract {
  @state(PublicKey) value = State<PublicKey>();

  @method giveAnswer(answer: Field, value: PublicKey) {
    // below a simple question
    // lets check if given answer is gte 18
    answer.assertGte(Field(18));

    // whoever manages to solve this and knows the answer
    // can prove this withought actually sharing the answer
    // i.e the answer you provide, never leaves your local env

    // imagine if the computation cost required to find / check
    // the answer was high. zkapp let us do all the compute
    // on the client side, and then send the proof over to the network!

    // if assertion passes, update state
    let value_ = this.value.get();
    this.value.assertEquals(value_);
    this.value.set(value);
  }
}
