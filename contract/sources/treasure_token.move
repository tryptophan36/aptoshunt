module token_drop::treasure_token {
    use std::vector;
    use aptos_framework::signer;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};

    // Struct to hold details of a token drop
    struct TokenDrop has store {
        creator: address,
        amount: u64,
        claims_left: u64,
        addresses_claimed: vector<address>,
    }

    // Main state struct to track all token drops
    struct TokenDropState has key {
        drops: Table<Location, TokenDrop>,
    }

    // Struct to represent a location with latitude and longitude
    struct Location has copy, drop, store {
        latitude: u64,
        longitude: u64,
    }

    // Errors
    const ERROR_NOT_INITIALIZED: u64 = 1;
    const ERROR_ALREADY_CLAIMED: u64 = 2;
    const ERROR_DROP_NOT_FOUND: u64 = 3;
    const ERROR_NO_CLAIMS_LEFT: u64 = 4;

    // Function to initialize the token drop state
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<TokenDropState>(account_addr), ERROR_NOT_INITIALIZED);

        move_to(account, TokenDropState {
            drops: table::new(),
        });
    }

    // Function to drop tokens at a specific location
    public entry fun drop_token(
        account: &signer,
        amount: u64,
        claims_allowed: u64,
        latitude: u64,
        longitude: u64
    ) acquires TokenDropState {
        let account_addr = signer::address_of(account);
        let state = borrow_global_mut<TokenDropState>(account_addr);

        let location = Location { latitude, longitude };
        let token_drop = TokenDrop {
            creator: account_addr,
            amount,
            claims_left: claims_allowed,
            addresses_claimed: vector::empty(),
        };

        table::add(&mut state.drops, location, token_drop);
    }

    // Function to claim a token from a specific location
    public entry fun claim_token(
        account: &signer,
        latitude: u64,
        longitude: u64
    ) acquires TokenDropState {
        let account_addr = signer::address_of(account);
        let state = borrow_global_mut<TokenDropState>(account_addr);
        let location = Location { latitude, longitude };

        assert!(table::contains(&state.drops, location), ERROR_DROP_NOT_FOUND);
        let drop = table::borrow_mut(&mut state.drops, location);

        assert!(drop.claims_left > 0, ERROR_NO_CLAIMS_LEFT);
        assert!(!vector::contains(&drop.addresses_claimed, &account_addr), ERROR_ALREADY_CLAIMED);

        drop.claims_left = drop.claims_left - 1;
        vector::push_back(&mut drop.addresses_claimed, account_addr);
    }

    // Helper function to check if a token drop exists at a location
    public fun token_drop_exists(latitude: u64, longitude: u64): bool acquires TokenDropState {
        let state = borrow_global<TokenDropState>(@token_drop);
        table::contains(&state.drops, Location { latitude, longitude })
    }

    // Helper function to get the number of claims left for a token drop
    public fun get_claims_left(latitude: u64, longitude: u64): u64 acquires TokenDropState {
        let state = borrow_global<TokenDropState>(@token_drop);
        let location = Location { latitude, longitude };
        assert!(table::contains(&state.drops, location), ERROR_DROP_NOT_FOUND);
        let drop = table::borrow(&state.drops, location);
        drop.claims_left
    }

    // A test helper function
    #[test_only]
    public fun initialize_for_test(account: &signer) {
        initialize(account);
    }
}
