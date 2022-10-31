import {
  state,
  State,
  method,
  PublicKey,
  Field,
  SmartContract,
  Poseidon,
} from 'snarkyjs';

export { OracleAgeProof_ };

class OracleAgeProof_ extends SmartContract {
  @state(PublicKey) state_address = State<PublicKey>();
  readonly solution =
    Field.fromBigInt(
      1496957778934480235378927615462090253963603497313444697603913632931794435306n
    );

  @method giveAnswer(oracleID: Field, age: Field, address: PublicKey) {
    // check if the provided age is gte 18
    age.assertGte(18);

    let hashChainValue = Poseidon.hash([oracleID]);

    for (let i = 0; i < age.toBigInt(); ++i) {
      hashChainValue = Poseidon.hash([hashChainValue]);
    }

    // solution (age encryption procided by the oracle)
    // check if the provided age is true
    hashChainValue.assertEquals(this.solution);

    // if assertion passes, update state
    let value_ = this.state_address.get();
    this.state_address.assertEquals(value_);
    this.state_address.set(address);
  }
}
