module tbp_world::application_form {
	use std::signer;
	use std::vector;
	use std::string::{String};
	use std::simple_map::{SimpleMap, Self};

	const ENotAnOwner: u64 = 0;

	const EApplicationWasPlaced: u64 = 10;
	const EApplicationWasNotPlaced: u64 = 11;

	const EApplicationWasApproved: u64 = 20;
	const EApplicationWasNotApproved: u64 = 21;

	struct State has key, store {
		application: SimpleMap<address, String>,
		approved: SimpleMap<address, String>,

		members: SimpleMap<address, vector<address>>
	}

	fun init_module(owner: &signer) {
		let new_state: State = State {
			application: simple_map::new<address, String>(),
			approved: simple_map::new<address, String>(),

			members: simple_map::new<address, vector<address>>()
		};

		move_to<State>(owner, new_state);
	}

	entry fun add_application(sender: &signer, hash_data: String) acquires State {
		let state: &mut State = borrow_global_mut<State>(@tbp_world);
		let sender_address: address = signer::address_of(sender);

		assert!(!simple_map::contains_key<address, String>(&state.application, &sender_address), EApplicationWasPlaced);
		assert!(!simple_map::contains_key<address, String>(&state.approved, &sender_address), EApplicationWasApproved);

		simple_map::add<address, String>(&mut state.application, sender_address, hash_data);
	}

	entry fun review_application(owner: &signer, applicant: address, isApproved: bool) acquires State {
		assert!(signer::address_of(owner) == @tbp_world, ENotAnOwner);

		let state: &mut State = borrow_global_mut<State>(@tbp_world);

		assert!(simple_map::contains_key<address, String>(&mut state.application, &applicant), EApplicationWasNotPlaced);
		assert!(!simple_map::contains_key<address, String>(&mut state.approved, &applicant), EApplicationWasApproved);

		let (_application_owner, hash_data): (address, String) = simple_map::remove<address, String>(&mut state.application, &applicant);

		if(isApproved) {
			simple_map::add<address, String>(&mut state.approved, applicant, hash_data);
		};

		simple_map::add(&mut state.members, applicant, vector::empty<address>());
	}

	entry fun invite_member(sender: &signer, member: address) acquires State {
		let sender_address = signer::address_of(sender);

		let state: &mut State = borrow_global_mut<State>(@tbp_world);

		assert!(simple_map::contains_key<address, String>(&mut state.approved, &sender_address), EApplicationWasNotApproved);

		let members: &mut vector<address> = simple_map::borrow_mut(&mut state.members, &sender_address);

		vector::push_back<address>(members, member);
	}

	#[view]
	public fun is_invited(owner: address, member: address): bool acquires State {
		let state: &mut State = borrow_global_mut<State>(@tbp_world);

		return simple_map::contains_key<address, String>(&mut state.approved, &owner) && vector::contains(simple_map::borrow(&state.members, &owner), &member)
	}

	#[view]
	public fun get_all_approved(): (vector<address>, vector<String>) acquires State {
		let approved: &SimpleMap<address, String> = &borrow_global<State>(@tbp_world).approved;
		simple_map::to_vec_pair(*approved)
	}

	#[view]
	public fun get_applications(): (vector<address>, vector<String>) acquires State {
		let application: &SimpleMap<address, String> = &borrow_global<State>(@tbp_world).application;
		simple_map::to_vec_pair(*application)
	}
}