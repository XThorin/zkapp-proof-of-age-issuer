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
  @state(PublicKey) stateAddress = State<PublicKey>();

  @method giveAnswer(answer: Field, address: PublicKey) {
    const ageToProve = 18;

    let hashChainValue = answer;

    for (let i = 0; i < ageToProve; ++i) {
      hashChainValue = Poseidon.hash([hashChainValue]);
    }

    // solution (age encryption procided by the oracle)
    // check if the provided age is true
    let solution =
      Field.fromBigInt(
        1496957778934480235378927615462090253963603497313444697603913632931794435306n
      );

    hashChainValue.assertEquals(solution);

    // if assertion passes, update state
    let value_ = this.stateAddress.get();
    this.stateAddress.assertEquals(value_);
    this.stateAddress.set(address);
  }
}
